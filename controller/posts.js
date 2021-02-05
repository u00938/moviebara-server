const { post, movie, user, scrap } = require('../models')
const sequelize = require('sequelize')

module.exports = {
  post: async (req, res) => {
    const { text, rate, user_id, movie_id } = req.body;
    if (text && rate && user_id && movie_id) {
      const newPost = await post.create({ text, rate, user_id, movie_id })
      await post.update({ user_id, movie_id }, { where: { id: newPost.id } })
      res.status(200).json({ message: "ok" })
    } else {
      res.status(400).json({ message: "should send full data" })
    }
  },
  getPostById: async (req, res) => {
    try {
      const query = req.query
      if (query.user_id) {
        const postByUser = await post.findAll({
          attributes: ['id', 'text', 'rate', 'user_id', 'movie_id', 'createdAt', 'updatedAt'],
          include: [
            { model: user, attributes: ['image', 'nickname'] }, 
            { model: movie, attributes: ['title', 'image', 'genre'] }, 
            { model: scrap, attributes: ['post_id', [sequelize.fn("count", sequelize.col('post_id')), "count"]], group: "post_id"}
          ],
          where: { user_id: query.user_id }
        })
        if (postByUser) res.status(200).json({post: postByUser})
        else res.status(400).json({ message: "There's no post of user" })
      }
      if (query.movie_id) {
        const postByMovie = await post.findAll({
          attributes: ['id', 'text', 'rate', 'user_id', 'movie_id', 'createdAt', 'updatedAt'],
          where: { movie_id: query.movie_id }
        })
        if (postByMovie) res.status(200).json(postByMovie)
        else res.status(400).json({ message: "There's no post of user" })
      }
      res.status(400).json({ message: "need some id" })
    } catch (err) {
      console.log(err)
    }
  },
  updatePost: (req, res) => {
    res.send('no')
  },
  deletePost: (req, res) => {
    res.send('no')
  }
}