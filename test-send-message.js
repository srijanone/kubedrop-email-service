#!/usr/bin/env node

const fs = require('fs');

const { KafkaService } = require('./src/services');

const main = async () => {
    console.log('[+] Sending Message');

    const kafkaService = new KafkaService();

    let data = fs.readFileSync('./testdata/payload1.json').toString();

    const message = JSON.parse(data);
    
    const topic = 'article.created';

    await kafkaService.sendMessage(topic, message);

    console.log(`[+] Message Sent to topic: ${topic}`);
};

if (require.main === module) {
    main().catch(e => console.error(`[-] Error: ${e.message}`, e));
}