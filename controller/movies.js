const { movie } = require('../models')

module.exports = {
  get: async (req, res) => {
    try {
      if (req.query) {
        const query = req.query
        if (query.movie_title) {
          const movieByTitle = await movie.findOne({ where: { title: query.movie_title } })
          if (movieByTitle) res.json(movieByTitle)
          else res.status(400).json({ message: "Couldn't find this movie." })
        }
        if (query.movie_id) {
          const movieById = await movie.findOne({ where: { id: query.movie_id } })
          if (movieById) res.json(movieById)
          else res.status(400).json({ message: "Couldn't find this movie." })
        }
      }
      else {
        const movies = await movie.findAll();
        res.status(200).json(movies)
      }
    } catch (err) {
      console.log(err)
    }
  },
}