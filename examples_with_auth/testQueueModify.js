const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'Client', 32, 1, jwt_token);


let transaction = message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${msg}`);
    if (msg.StreamRequestTypeData == "ReceiveMessage") {
        msg.Metadata = "new meta data"
        msg.Channel = "testQueue"
        msg.ClientID = "Client"
        console.log("Received Message sending modify request.");
        transaction.modify(msg).then(_ => {
            console.log('Body:' + kubemq.byteToString(msg.Body));
            console.log(msg);
        });
    }
}

function errorHandler(msg) {
    console.log(`Received error ${msg}`);
};

transaction.receive(5, 10, queueHandler, errorHandler);
