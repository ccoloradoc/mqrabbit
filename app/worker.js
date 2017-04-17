#!/usr/bin/env node

var config = require('./config');
var MQService = require('./modules/mqservice');

var service = new MQService(config);

service.subscribe('task_queue', function(msg, processed) {
  console.log(" [x] Received %s", msg.content.toString());
  processed();
});
