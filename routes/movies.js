const express = require('express')
const router = express.Router();
const controller = require('../controller/movies')

router.get('/', controller.get)
router.get('/:movie_id', controller.getMovieById)

module.exports = router;