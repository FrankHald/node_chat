'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var path = require('path');

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static('public'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected!');
});

var Message = require('./models/message');

for (var i = 0; i <= 30; i++) {
  var message = addMessage('message' + i, 'name' + i);
  message.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent!');
    }
  });
}

function addMessage(msg, name) {
  var message = new Message({
    message: msg,
    name: name
  });
  message.printMessage();

  return message;
}

router.route('/messages')
  .get(function(req, res) {
    Message.find(function(err, messages) {
      if (err) {
        res.send(err);
      } else {
        res.json(messages);
      }
    });
  })
  .post(function(req, res) {
    var msg = req.body.message;
    var name = req.body.name;

    var message = addMessage(msg, name);
    message.save(function(err) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        res.json({message: 'Message sent!'});
      }
    });
  });

router.route('/messages/:id')
  .get(function(req, res) {
    var params_id = req.params.id;

    Message.findOne({_id: params_id}, function(err, message) {
      if (err || !message) {
        res.status(404);
        res.sendFile(path.join(__dirname + '/public/404.html'));
      } else {
        res.json(message);
      }
    })
  })
  .delete(function(req, res) {
    var params_id = req.params.id;

    Message.findByIdAndRemove(params_id, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json('Message deleted!');
      }
    })
  })
  .put(function(req, res) {
    var params_id = req.params.id;
    var message = req.body.message;

    Message.findOneAndUpdate({_id: params_id}, {$set: {message: message}}, {new: true}, function(err, msg) {
      if (err) {
        res.send(err)
      } else {
        res.json('Message updated');
      }
    });
  });

app.use('/', router);

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
