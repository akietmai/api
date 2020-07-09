const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  Username: String,
  Password: String,
  Active: Boolean,
  CodeActive: String,
  Group: Number,
  RegisterDate: Date,
  Fullname: String,
  Email: String,
  Phone: String,
  Address: String,
});

module.exports = mongoose.model('User', userSchema);
