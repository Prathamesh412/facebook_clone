var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var pageSchema = new mongoose.Schema({
  pageName: String,
  description:String,
  pageAdmin:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  pageMod: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  pageEditor:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports =mongoose.model('Page',pageSchema);