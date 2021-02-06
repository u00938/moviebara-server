const express = require('express')
const router = express.Router();
const controller = require('../controller/scraps')

router.post('/', controller.post)
router.get('/', controller.getScrapById)
router.delete('/', controller.deleteScrap)

module.exports = router;