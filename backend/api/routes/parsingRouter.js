const express = require('express');

const router = express.Router();
const multer = require('../../config/multer.config')
const saft = require('../controllers/parsingController');

router.post('/upload', multer.single('saft'), saft.uploadParseSaft)
router.post('/uploadNoValidation', multer.single('saft'), saft.uploadParseSaftPromise)

module.exports = router;