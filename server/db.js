var config = require('./config')

var mongoose = require('mongoose');
var user = require("./schema/user")

mongoose.connect('mongodb://localhost/verynginx');
var db = mongoose.connection;


module.exports.UsersShema = user
module.exports.UserModel = mongoose.model('users', user)