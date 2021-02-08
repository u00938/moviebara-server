const { movie } = require('../models')
const jwt = require('jsonwebtoken');

const verifyToken = (req, res) => {
  jwt.verify(req.cookies.accessToken, process.env.ACCESS_SECRET, (err, result) => {
    delete result.iat;
    delete result.exp;
    if (err) {
      res.status(400).send({ message: "invalid access token" })
    } else {
      return new Promise((resolve, reject) => {
        jwt.sign(result, process.env.ACCESS_SECRET, { expiresIn: '7d' }, (error, token) => {
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
  get: async (req, res) => {
    try {
      verifyToken(req, res)
      const query = req.query
      if (query.movie_title) {
        const movieByTitle = await movie.findOne({ where: { title: query.movie_title } })
        if (movieByTitle) res.status(200).json(movieByTitle)
        else res.status(400).json({ message: "Couldn't find this movie." })
      }
      else if (query.movie_id) {
        const movieById = await movie.findOne({ where: { id: query.movie_id } })
        if (movieById) res.json(movieById)
        else res.status(400).json({ message: "Couldn't find this movie." })
      }
      else {
        const movies = await movie.findAll();
        res.status(200).json(movies)
      }
    } catch {
      res.status(500).send()
    }
  },
}