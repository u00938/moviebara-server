// const { user } = require('../models')

module.exports = {
  post: (req, res) => {
    if(!req.cookies.refreshToken) {
      res.status(400).json({ message: 'not authorized' })
    } else {
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'ok' })
    }
  }
}