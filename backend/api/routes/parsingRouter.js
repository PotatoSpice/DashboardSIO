const express = require('express');
const router = express.Router();
const saft = require('../controllers/parsingController');

router.post('/upload', saft.uploadParseSaft)

module.exports = router;