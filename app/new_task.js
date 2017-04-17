#!/usr/bin/env node

var config = require('./config');
var cp = require('./modules/cp');
var msg = process.argv.slice(2).join(' ') || "Hello World!";

cp.task(config.MQ_URL, 'task_queue', msg, function() {
    console.log('Message send...');
});
