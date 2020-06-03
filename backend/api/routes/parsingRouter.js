const express = require('express');

const router = express.Router();
const multer = require('../../config/multer.config')
const saft = require('../controllers/parsingController');

router.post('/upload', multer.single('saft'), saft.uploadParseSaft)

module.exports = router;