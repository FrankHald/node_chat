var mongoose = require('mongoose');
var schema = mongoose.Schema;

var message = new schema({
  name: String,
  message: String,
  time: {type: Date, default: Date.now }
});
message.methods.printMessage = function() {
  console.log(this.message);
};

module.exports = mongoose.model('Message', message);
