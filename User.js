var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;