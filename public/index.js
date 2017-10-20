var messages_div = $('#all-messages');
var messages = [];

setInterval(function(){
  getMessages();
}, 2000);

$('#new-message').submit(function(event) {
  var message = $('#message').val();
  var name = $('#name').val();

  postMessage(message, name);
  getMessages();
  $('#message').val('');

  event.preventDefault();
});

function postMessage(message, name){
  var url = 'http://localhost:8080/messages';
  $.post(url, {message: message, name: name})
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getMessages(){
  var url = 'http://localhost:8080/messages';
  var messages_temp = [];

  $.get(url, function(data) {
    $.each(data, function(i, value) {
      var id = value._id;
      var message = value.message;
      var name = value.name;
      var time = value.time;

      messages_temp.push({id: id, message: message, name: name, time: time});
    });
  }).then(function() {
    if (messages.length === 0) {
      messages = messages_temp;
      $.each(messages, function(i, value) {
        var id = value.id;
        var message = value.message;
        var name = value.name;
        var time = value.time;

        messages_div.append(id + " " + name + " " + message + " " + time + "<br>");
      });
    }

    if (messages[messages.length-1].id !== messages_temp[messages_temp.length-1].id) {
      for (var i = messages.length; i < messages_temp.length; i++) {
        var id = messages_temp[i].id;
        var message = messages_temp[i].message;
        var name = messages_temp[i].name;
        var time = messages_temp[i].time;

        messages.push({id: id, message: message, name: name});
        messages_div.append(id + " " + name + " " + message + " " + time + "<br>");
      }
    }
  });
}
