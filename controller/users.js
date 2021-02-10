const { user } = require('../models')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Op = require('sequelize').Op;

module.exports = {
  get: async (req, res) => {
    try {
      const token = req.cookies.accessToken
      jwt.verify(token, process.env.ACCESS_SECRET, async (error, result) => {
        const myInfo = await user.findOne({ where: { id: result.id }, attributes: { exclude: ['password'] } })
        if (myInfo) res.status(200).send(myInfo)
        else res.status(400).send({ message: 'invalid user' })
      })
    } catch (err) {
      console.error(err)
    }
  },
  signUp: async (req, res) => {
    try {
      const { nickname, password, email } = req.body;
      const sameNickname = await user.findOne({ where: { nickname } })
      const sameEmail = await user.findOne({ where: { email } })

      if (sameNickname) {
        res.status(400).json({ message: "existed nickname" })
      } else if (sameEmail) {
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
    } catch (err) {
      console.error(err)
    }
  },
  getUserById: async (req, res) => {
    try {
      const id = req.params.user_id;
      const userInfo = await user.findOne({ attributes: ['nickname', 'email', 'image'], where: { id } })
      if (!userInfo) res.status(404).json({ message: "invalid user" })
      else res.status(200).json(userInfo)
    } catch (err) {
      console.error(err)
    }
  },
  updateUserInfo: async (req, res) => {
    try {
      const token = req.cookies.accessToken
      jwt.verify(token, process.env.ACCESS_SECRET, async (error, result) => {
        const { nickname, image, password } = req.body;
        const sameNickname = await user.findOne({ where: { nickname, id: { [Op.ne]: result.id } } })
        if (sameNickname) {
          res.status(400).json({ message: "existed nickname" })
        } else {
          const salt = await bcrypt.genSalt();
          const pwd = await bcrypt.hash(password, salt)
          await user.update({ nickname, image, password: pwd }, { where: { id: result.id } })
          res.status(200).json({ message: "update success" })
        }
      })
    } catch (err) {
      console.error(err)
    }
  },
  checkPassword: async (req, res) => {
    try {
      const token = req.cookies.accessToken
      jwt.verify(token, process.env.ACCESS_SECRET, async (error, result) => {
        const userInfo = await user.findOne({ where: { id: result.id } })
        const isSame = await bcrypt.compare(req.body.password, userInfo.password)
        if (isSame) res.status(200).json({ message: "same password" })
        else res.status(400).json({ message: "wrong password" })
      })
    } catch (err) {
      console.error(err)
    }
  }
}