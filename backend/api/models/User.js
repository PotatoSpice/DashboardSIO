var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    details:  {type: String}
});

module.exports = mongoose.model('User', UserSchema);