const { post, movie, user, scrap } = require('../models')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken');

const verifyToken = (req, res) => {
  jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET, (err, result) => {
    delete result.iat;
    delete result.exp;
    if (err) {
      res.status(400).send({ message: "invalid access token" })
    } else {
      return new Promise((resolve, reject) => {
        jwt.sign(result, process.env.ACCESS_SECRET, { expiresIn: '1d' }, (error, token) => {
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
  // post: async (req, res) => {
  //   try {
  //     verifyToken(req, res)
  //     const { text, rate, userId, movieId } = req.body;
  //     if (text && rate && userId && movieId) {
  //       await post.create({ text, rate, userId, movieId })
  //       res.status(200).json({ message: "ok" })
  //     } else {
  //       res.status(400).json({ message: "should send full data" })
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // },
  post: (req, res) => {
    try {
      jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET, (err, result) => {
        delete result.iat;
        delete result.exp;
        if (err) {
          res.status(400).send({ message: "invalid access token" })
        } else {
          return new Promise((resolve, reject) => {
            jwt.sign(result, process.env.ACCESS_SECRET, { expiresIn: '1d' }, (error, token) => {
              if (error) reject(error)
              else resolve(token)
            })
          }).then(async token => {
            res.cookie('accessToken', token, {
              domain: 'localhost',
              path: '/',
              httpOnly: true,
              // secure: true, (https 사용시 추가)
              sameSite: 'none',
              maxAge: 1000 * 60 * 60 * 24,
              overwrite: true
            })
            const { text, rate, userId, movieId } = req.body;
            if (text && rate && userId && movieId) {
              await post.create({ text, rate, userId, movieId })
              res.status(200).json({ message: "ok" })
            } else {
              res.status(400).json({ message: "should send full data" })
            }
          })
        }
      })
    } catch {
      res.status(500).send()
    }
  },
  getPostById: async (req, res) => {
    try {
      verifyToken(req, res)
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
    } catch {
      res.status(500).send()
    }
  },
  updatePost: async (req, res) => {
    try {
      verifyToken(req, res)
      const { text, rate, userId, movieId } = req.body;
      await post.update({ text, rate }, { where: { userId, movieId } });
      res.status(200).json({ message: "update success" })
    } catch {
      res.status(500).send()
    }
  },
  deletePost: async (req, res) => {
    try {
      verifyToken(req, res)
      const { postId } = req.body;
      await post.destroy({ where: { id: postId } })
      res.status(200).json({ message: "delete success" })
    } catch {
      res.status(500).send()
    }
  }
}