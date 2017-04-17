#!/usr/bin/env node

var config = require('./config/development');
var cp = require('./modules/cp');
var msg = process.argv.slice(2).join(' ') || "Hello World!";

cp.task(config.mq.url, 'task_queue', msg, function() {
    console.log('Message send...');
});
