const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client', 32, 1, jwt_token);


let transaction = message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${JSON.stringify(msg.Message)}`);
    if (msg.StreamRequestTypeData === "ReceiveMessage") {
        console.log("Received Message sending resend request.");
        transaction.resend('testQueue').then(_ => {
            console.log(`sent resend`);
        });
    }
}

function errorHandler(msg) {
    console.log(`Received error ${JSON.stringify(msg)}`);
};

transaction.receive(5, 10, queueHandler, errorHandler);
