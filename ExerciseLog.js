var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LogSchema = new Schema({
  user_id: {type:String, required: true},
  description: {type:String, required: true},
  duration: {type:Number, required: true},
  date: {type: Date, required: true}
});

const ExerciseLog = mongoose.model('Exercise_Log', LogSchema);

module.exports = ExerciseLog;