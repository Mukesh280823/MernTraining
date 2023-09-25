
const mongoose = require('mongoose');
const LoginUser = mongoose.model('LoginUser', {
    email: String,
    password: String,
  });

  module.exports = LoginUser;