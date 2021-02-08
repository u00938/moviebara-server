const express = require('express')
const router = express.Router();
const controller = require('../controller/users')

router.get('/', controller.get)
router.post('/', controller.signUp)
router.get('/:user_id', controller.getUserById)
router.patch('/', controller.updateUserInfo)
router.post('/verifyPassword', controller.checkPassword)

module.exports = router;