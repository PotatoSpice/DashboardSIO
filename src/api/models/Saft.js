var mongoose = require('mongoose');

var SaftSchema = new mongoose.Schema({
});

module.exports = mongoose.model('Saft', SaftSchema, 'saft');