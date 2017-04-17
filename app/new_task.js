#!/usr/bin/env node

var config = require('./config');
var MQService = require('./modules/mqservice');

var msg = process.argv.slice(2).join(' ') || "Hello World!";

var service = new MQService(config);

service.send('task_queue', msg, function() {
  console.log('Message send...');
});
