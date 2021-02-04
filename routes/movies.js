const express = require('express')
const router = express.Router();
const controller = require('../controller/movies')

router.get('/', controller.get)

module.exports = router;