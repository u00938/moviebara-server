const express = require('express')
const router = express.Router();
const controller = require('../controller/logout')

router.post('/', controller.post)

module.exports = router;