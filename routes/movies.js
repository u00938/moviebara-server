const express = require('express')
const router = express.Router();
const controller = require('../controller/movies')
const tokenMiddleware = require('../middleware/token');

router.get('/', tokenMiddleware, controller.get)

module.exports = router;