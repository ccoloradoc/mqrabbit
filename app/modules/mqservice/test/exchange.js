var colors = require('colors');
var config = require('../../../config');
var MQService = require('../../mqservice');

var mqservice = new MQService(config);
var ex = 'resolved';
var i = 0;

setInterval(function() {
  mqservice.fanout(ex, "Ping " + (i++));
  var msg = "> Sent : [Ping " + i + "]";
  console.log(msg.green);
}, 1000);

mqservice.exchange(ex, function(payload, ack) {
  var msg = " < Consumer #1 [" + payload + "]";
  console.log(msg.cyan);
});

mqservice.exchange(ex, function(payload, ack) {
  var msg = " < Consumer #2 [" + payload + "]";
  console.log(msg.yellow);
});
