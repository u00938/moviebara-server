const express = require('express')
const router = express.Router();
const controller = require('../controller/users')

router.get('/', controller.get)
router.post('/', controller.post)
router.get('/:user_id', controller.getUserById)
router.patch('/', controller.updateUserInfo)

module.exports = router;