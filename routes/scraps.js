const express = require('express')
const router = express.Router();
const controller = require('../controller/scraps')
const tokenMiddleware = require('../middleware/token');

router.post('/', tokenMiddleware, controller.post)
router.get('/', tokenMiddleware, controller.getScrapById)
router.delete('/', tokenMiddleware, controller.deleteScrap)

module.exports = router;