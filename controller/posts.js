const { post, movie, user, scrap } = require('../models')
const sequelize = require('sequelize')

module.exports = {
  post: async (req, res) => {
    const { text, rate, userId, movieId } = req.body;
    if (text && rate && userId && movieId) {
      await post.create({ text, rate, userId, movieId })
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
          attributes: ["id", "text", "rate", "createdAt", [sequelize.fn("COUNT", sequelize.col("scraps.id")), "scrap"]],
          include: [
            { model: scrap, attributes: [] },
            { model: user, attributes: ["nickname", "image"] },
            { model: movie, attributes: ["title", "image", "genre"] }
          ],
          group: ["id"],
          where: { userId: query.user_id },
        })
        if (postByUser) res.status(200).json({ post: postByUser })
        else res.status(400).json({ message: "There's no post of user" })
      }
      if (query.movie_id) {
        const postByMovie = await post.findAll({
          attributes: ["id", "text", "rate", "createdAt", [sequelize.fn("COUNT", sequelize.col("scraps.id")), "scrap"]],
          include: [
            { model: user, attributes: ["nickname", "image"] },
            { model: scrap, attributes: [] },
          ],
          group: ["id"],
          where: { movieId: query.movie_id }
        })
        if (postByMovie) res.status(200).json({ post: postByMovie })
        else res.status(400).json({ message: "There's no post of user" })
      }
      res.status(400).json({ message: "need some id" })
    } catch (err) {
      console.log(err)
    }
  },
  updatePost: async (req, res) => {
    const { text, rate, userId, movieId } = req.body;
    await post.update({ text, rate }, { where: { userId, movieId } });
    res.status(200).json({ message: "update success" })
  },
  deletePost: async (req, res) => {
    const { postId } = req.body;
    await post.destroy({ where: { id: postId } })
    res.status(200).json({ message: "delete success" })
  }
}