var colors = require('colors');
var config = require('../../../config');
var MQService = require('../../mqservice');

var mqservice = new MQService(config);
var queue = 'task_1';
var i = 0;

setInterval(function() {
  mqservice.send(queue, "Ping " + (i++), function(payload) {
    var msg = "> Payload [" + payload + "]";
    console.log(msg.green);
  });
}, 1000);

mqservice.subscribe(queue, function(payload, ack) {
  var msg = " < Consumer #1 [" + payload.content.toString() + "]";
  console.log(msg.yellow);
  ack();
});

mqservice.subscribe(queue, function(payload, ack) {
  var msg = " < Consumer #2 [" + payload.content.toString() + "]";
  console.log(msg.cyan);
  ack();
});
