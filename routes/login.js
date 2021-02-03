const express = require('express')
const router = express.Router();
const controller = require('../controller/login')

router.post('/', controller.post)

module.exports = router;