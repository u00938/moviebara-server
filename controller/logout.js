const jwt = require('jsonwebtoken');

module.exports = {
  post: (req, res) => {
    // 헤더에 담긴 accessToken을 token으로 지정
    const authorization = req.headers['authorization']
    const token = authorization.split(' ')[1];
    // < accessToken이 존재할 경우 >
    if(token) {
      jwt.verify(token, process.env.ACCESS_SECRET, (err, result) => {
        if(err) {
          // 해당 accessToken이 유효하지 않다면, 에러메시지
          res.status(400).send({ message: "invalid access token" })
        } else {
          // 해당 accessToken이 유효하다면, refreshToken도 유효한지 검토
          jwt.verify(req.cookies.refreshToken, process.env.REFRESH_SECRET, (error, result) => {
            if(error) {
              // refreshToken이 유효하지 않다면, 에러메시지
              res.status(400).send({ message: "invalid refresh token" })
            } else {
              // refreshToken이 유효하다면, 쿠키에서 삭제
              res.clearCookie('refreshToken');
              res.status(200).json({ message: 'logout ok, Now you can delete accessToken' })
            }
          })
        }
      })
    } 

    // < accessToken이 존재하지 않을 경우 >
    else {
      // refreshToken 또한 없는지 판단
      if(!req.cookies.refreshToken) {
        // 2가지 종류의 token이 모두 없는 상황이라면 이미 로그아웃된 상황
        res.status(400).json({ message: 'You are already logged out' })
      } else {
        // refreshToken이 존재할 경우
        jwt.verify(req.cookies.refreshToken, process.env.REFRESH_SECRET, (err, result) => {
          if(err) {
            // 해당 refreshToken이 유효하지 않다면, 에러메시지
            res.status(400).send({ message: "invalid refresh token" })
          } else {
            // refreshToken이 유효하다면, 쿠키에서 삭제
            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'logout ok' })
          }
        })
      }
    }
  }
}