const { user } = require('../models')
const jwt = require('jsonwebtoken');
const accessKey = process.env.ACCESS_SECRET;
const refreshKey = process.env.REFRESH_SECRET;

module.exports = {
  post: async (req, res) => {
    const userInfo = await user.findOne({
      where: { email: req.body.email, password: req.body.password }
    })
    
    if(!userInfo) {
      res.status(400).json({
        "message":"go away! I don't know you "
      })
    } else {
      const getToken = (key, age) => {
        return new Promise((res, rej) => {
          jwt.sign({
            id: userInfo.id,
            nickname: userInfo.nickname,
            email: userInfo.email,
            image: userInfo.image,
            createdAt: userInfo.createdAt,
            updatedAt: userInfo.updatedAt
          }, key, {
            expiresIn: age
          },
          function(err,token) {
            if(err) rej(err)
            else res(token)
          })
        })
      }
      getToken(refreshKey, '7d').then(token => {
        res.cookie('refreshToken', token, {
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
      })
      getToken(accessKey, '1d')
      .then(token => {
        res.status(201).json({ 
          "accessToken": token
        })
      })
    }
  }
};
