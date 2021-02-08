const { user } = require('../models')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Op = require('sequelize').Op;

const id = []
const verifyToken = (req, res) => {
  jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET, (err, result) => {
    id.push(result.id)
    delete result.iat;
    delete result.exp;
    if (err) {
      res.status(400).send({ message: "invalid access token" })
    } else {
      return new Promise((resolve, reject) => {
        jwt.sign(result, process.env.ACCESS_SECRET, { expiresIn: '7d' }, (error, token) => {
          if (error) reject(error)
          else resolve(token)
        })
      }).then(token => {
        res.cookie('accessToken', token, {
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          // secure: true, (https 사용시 추가)
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24,
          overwrite: true
        })
      })
    }
  })
}

module.exports = {
  get: async (req, res) => {
    try {
      verifyToken(req, res)
      const myInfo = await user.findOne({ where: { id: id[0] } })
      if (myInfo) res.status(200).send(myInfo)
      else res.status(400).send({ message: 'invalid user' })
    } catch(error) {
      console.error(error)
    }

  },
  signUp: async (req, res) => {
    try {
      const { nickname, password, email } = req.body;
      const sameNickname = await user.findOne({ where: { nickname } })
      const sameEmail = await user.findOne({ where: { email } })

      if (sameNickname) {
        res.status(400).json({ message: "existed nickname" })
      } else if(sameEmail) {
        res.status(400).json({ message: "existed email" })
      } else {
        const salt = await bcrypt.genSalt();
        const pwd = await bcrypt.hash(password, salt)
        if (nickname && password && email) {
          await user.create({ nickname, password: pwd, email })
          res.status(200).json({ message: "welcome!" })
        } else {
          res.status(400).json({ message: "should send full data" })
        }
      }
    } catch {
      res.status(500).send()
    }
  },
  getUserById: async (req, res) => {
    try {
      verifyToken(req, res)
      const id = req.params.user_id;
      const userInfo = await user.findOne({ attributes: ['nickname', 'email', 'image'], where: { id } })
      if (!userInfo) res.status(404).json({ message: "invalid user" })
      else res.status(200).json(userInfo)
    } catch {
      res.status(500).send()
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      verifyToken(req, res)
      const { nickname, image, password } = req.body;
      const sameNickname = await user.findOne({ where: { nickname, id: { [Op.ne]: id[0] } } })
      if (sameNickname) {
        res.status(400).json({ message: "existed nickname" })
      } else {
        const salt = await bcrypt.genSalt();
        const pwd = await bcrypt.hash(password, salt)
        await user.update({ nickname, image, password: pwd }, { where: { id: id[0] } })
        res.status(200).json({ message: "update success" })
      }
    } catch {
      res.status(500).send()
    }
  },
  checkPassword: async (req, res) => {
    verifyToken(req, res)
    const userInfo = await user.findOne({ where: { id: id[0] } })
    const isSame = await bcrypt.compare(req.body.password, userInfo.password)
    if (isSame) res.status(200).json({ message: "same password" })
    else res.status(400).json({ message: "wrong password" })
  }
}