'use strict';

const sgMail = require('@sendgrid/mail');
const logger = require('pino')();

const config = require('../config');

class EmailService {

  constructor() {
    sgMail.setApiKey(config.EMAIL.SENDGRID_API_KEY);
  }

  // Async operation
  sendEmail(recipients, { subject, body, templateId, templateData }) {
    // "data" is optional parameter which might contain dynamic data

    const emailOptions = {
      to: recipients,
      from: config.EMAIL.FROM_EMAIL,
    };
    
    // If templateId exists, include options for template
    if(templateId) {
      logger.info('Using Template');
      emailOptions.templateId = templateId;
      emailOptions.dynamic_template_data = templateData;
    } else {
      emailOptions.subject = subject; 
      emailOptions.html = body; 
    }

    const promise = sgMail.send(emailOptions);
    promise
      .then(data => {
        logger.info('mail sent');
      })
      .catch(error => {
        logger.error(error, 'error in sending mail');
      });

    return promise;
  }

  buildResponse() {
    return {
      status: 'SENDING'
    };
  }

}

module.exports = {
  EmailService
};
