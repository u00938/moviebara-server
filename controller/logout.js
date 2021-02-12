const jwt = require('jsonwebtoken');

module.exports = {
  post: (req, res) => {
    if(!req.cookies.accessToken) {
      res.status(400).json({ data: null, message: 'Please login first' })
    }
    jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET, (err, result) => {
      if(err) {res.status(400).json({
        data: null,
        message: "invalid access token"
      })} else {
        res.clearCookie('accessToken');
        res.status(200).json({ data: null, message: 'ok' })    
      }
    })
  }
}