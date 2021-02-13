const express = require('express')
const router = express.Router();
const controller = require('../controller/posts')
const tokenMiddleware = require('../middleware/token');

router.post('/', tokenMiddleware, controller.post)
router.get('/', controller.getPostById)
router.patch('/', tokenMiddleware, controller.updatePost)
router.delete('/', tokenMiddleware, controller.deletePost)

module.exports = router;