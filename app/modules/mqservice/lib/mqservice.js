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
      setTimeout(function() { conn.close(); }, 500);
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

  fanout(ex, payload) {
    amqp.connect(this.MQ_URL, function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertExchange(ex, 'fanout', {durable: false});
        ch.publish(ex, '', new Buffer(payload));
        //console.log(" [x] Sent %s", payload);
      });

      setTimeout(function() { conn.close();}, 500);
    });
  }

  exchange(ex, callback) {
    amqp.connect(this.MQ_URL, function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertExchange(ex, 'fanout', {durable: false});

        ch.assertQueue('', {exclusive: true}, function(err, q) {
          //console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
          ch.bindQueue(q.queue, ex, '');

          ch.consume(q.queue, function(payload) {
            //console.log(" [x] %s", msg.content.toString());
            callback(payload.content.toString());
          }, {noAck: true});
        });
      });
    });
  }
}

module.exports = MQService;
