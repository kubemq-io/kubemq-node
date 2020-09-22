const kubemq = require('../kubemq');

let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');


let transaction = message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${msg}`);
    if (msg.StreamRequestTypeData === "ReceiveMessage") {
        console.log("Received Message sending resend request.");
        transaction.resend('testQueue').then(_ => {
            console.log(`sent resend`);
        });
    }
}

function errorHandler(msg) {
    console.log(`Received error ${msg}`);
}

transaction.receive(5, 10, queueHandler, errorHandler);
