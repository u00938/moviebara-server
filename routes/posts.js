const express = require('express')
const router = express.Router();
const controller = require('../controller/posts')

router.post('/', controller.post)
router.get('/', controller.getPostById)
router.patch('/', controller.updatePost)
router.delete('/', controller.deletePost)

module.exports = router;