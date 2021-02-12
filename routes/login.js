const express = require('express')
const router = express.Router();
const controller = require('../controller/login')

router.post('/', controller.post)
router.post('/googleLogin', controller.googleLogin)

module.exports = router;