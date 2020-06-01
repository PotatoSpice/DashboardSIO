const express = require('express');

const saftRouter = require('./routes/saftRouter')
const parsingRouter = require('./routes/parsingRouter')

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: 'ok'
  })
});

router.use('/saft', saftRouter);
router.use(parsingRouter);

module.exports = router;
