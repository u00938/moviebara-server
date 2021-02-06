const { user } = require('../models')
const jwt = require('jsonwebtoken');
const accessKey = process.env.ACCESS_SECRET;
const refreshKey = process.env.REFRESH_SECRET;

module.exports = {
  post: async (req, res) => {
    // 필요한 모든 정보가 전달되었는지 여부
    const { email, password } = req.body;
    if(!email || !password) {
      // 정보가 더 필요하다면 에러메시지
      res.status(400).send({ message: "should send full data" })
    }
    // body에 담긴 정보로 유저정보를 불러온다.
    const userInfo = await user.findOne({
      where: { email: email, password: password }
    })
    
    if(!userInfo) {
      // 정보가 유효하지 않을 경우, 에러메시지
      res.status(400).json({
        "message":"go away! I don't know you "
      })
    } else {
      // 토큰을 발급하는 함수 생성
      const getToken = (key, age) => {
        return new Promise((res, rej) => {
          jwt.sign({
            // password는 토큰 정보에 담지 않음
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
      // refreshToken 발급 후, 쿠키에 전달(이 때, refreshToken의 유효기간은 cookie와 같게 설정)
      getToken(refreshKey, '7d').then(token => {
        res.cookie('refreshToken', token, {
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          // secure: true, (https 사용시 추가)
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
      })
      // accessToken 발급 후, 응답에 전송
      getToken(accessKey, '1d')
      .then(token => {
        res.status(201).json({ 
          "accessToken": token
        })
      })
    }
  }
};
