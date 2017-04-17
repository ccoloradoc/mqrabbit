'use strict';

var amqp = require('amqplib/callback_api');

class MQService {
  constructor(config) {
    try {
      if(!config || config.MQ_URL === undefined) {
        throw Error("Unable to access MQ Service url");
      } else {
        this.MQ_URL = config.MQ_URL;
      }
    } catch(e) {
      console.log(e);
    }
  }

  send(task, payload, callback) {
    amqp.connect(this.MQ_URL + "?heartbeat=60", function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertQueue(task, {durable: true});
        ch.sendToQueue(task, new Buffer(payload), {persistent: true});
        callback(payload);
      });
      setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
  }

  subscribe(task, callback) {
    amqp.connect(this.MQ_URL + "?heartbeat=60", function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertQueue(task, {durable: true});
        ch.prefetch(1);
        ch.consume(task, function(msg) {
          callback(msg, function() {
            ch.ack(msg);
          });
        }, {noAck: false});
      });
    });
  }
}

module.exports = MQService;
