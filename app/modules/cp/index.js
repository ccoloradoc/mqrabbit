var amqp = require('amqplib/callback_api');

module.exports = {
  task : function(url, task, payload, callback) {
    amqp.connect(url + "?heartbeat=60", function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertQueue(task, {durable: true});
        ch.sendToQueue(task, new Buffer(payload), {persistent: true});
        callback(payload);
      });
      setTimeout(function() { conn.close(); process.exit(0) }, 500);
    });
  },

  // Sample:
  // cp.task(config.MQ_URL, 'task_queue', msg, function() {
  //     console.log('Message send...');
  // });

  worker: function(url, task, callback) {
    amqp.connect(url, function(err, conn) {
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

  // Sample: 
  // cp.worker(config.MQ_URL, 'task_queue', function(msg, callback) {
  //     console.log(" [x] Received %s", msg.content.toString());
  //     callback();
  // });

}
