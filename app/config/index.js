'use strict';

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    MQ_URL: process.env.MQ_URL
  };
} else {
  module.exports = require('./development.json');
}
