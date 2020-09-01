#!/usr/bin/env node
'use strict';

const express = require('express');
const logger = require('pino')();

const { emailRouter, healthCheckRouter } = require('./controllers');
const { KafkaService, EmailService } = require('./services');
const config = require('./config');

const app = express();
const emailService = new EmailService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'Server is Running'
  });
});

// Adding routes
app.use(config['BASE_PATH'], healthCheckRouter);
app.use(config['BASE_PATH'], emailRouter);

// Adding 404 route
app.get('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

app.use(function(error, req, res, next) {
  logger.error(error.stack);
  // error.message

  const response = {
    success: false,
    errors: error.stack
  };
  res.status(500).json(response);
});

const startKafkaConsumer = async () => {
  const kafkaService = new KafkaService();
  
  await kafkaService.startConsumer(async ({ topic, partition, message }) => {
    logger.info('Received Event');

    const prefix = `${topic} [${partition} | ${message.offset}] / ${message.timestamp}\n`;
    logger.debug('Prefix:', prefix, message);

    const messageValue = message.value.toString();
    const payload = JSON.parse(messageValue);
    const data = payload.data.data;

    let subject = '';
    let body = '';

    try {
      subject = data['\u0000*\u0000values'].title['x-default'][0].value;
      body = data['\u0000*\u0000values'].body['x-default'][0].value;
    } catch (e) {
      logger.error(e, 'Invalid Payload');
    }
  
    if(subject && body) {
      logger.info('Sending emails');

      const recipients = config.EMAILS;
      emailService.sendEmail(recipients, { subject, body });
    } else {
      logger.error('Fields missing');
    }

  });
}

if (require.main == module) {
  app.listen(config['PORT'], _ => {
    logger.info(`Service started on port: ${config['PORT']}`);
  });

  startKafkaConsumer().catch(e => logger.error(`Error: ${e.message}`, e));
}

process.on('SIGINT', function() {
  process.exit();
});

module.exports = {
  app
};
