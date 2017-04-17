#!/usr/bin/env node

var config = require('./config/development');
var cp = require('./modules/cp');

cp.worker(config.mq.url, 'task_queue', function(msg, callback) {
    console.log(" [x] Received %s", msg.content.toString());
    callback();
});
