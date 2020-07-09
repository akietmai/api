const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
  Token: String,
  User: mongoose.Schema.Types.ObjectId,
  CreateDate: Date,
  State: Boolean,
});

module.exports = mongoose.model('Token', tokenSchema);
