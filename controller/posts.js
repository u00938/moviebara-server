const { post, movie, user } = require('../models')

module.exports = {
  post: (req, res) => {
    res.send('no')
  },
  getPostById: (req, res) => {
    if (req.query.user_id) {
      res.send(req.query.user_id)
    }
  },
  updatePost: (req, res) => {

  },
  deletePost: (req, res) => {
    
  }
}