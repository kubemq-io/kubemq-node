const kubemq = require('../../kubemq');

let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'Client');


let transaction = message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${msg}`);
    if (msg.StreamRequestTypeData === "ReceiveMessage") {
        msg.Metadata = "new meta data"
        msg.Channel = "testQueue"
        msg.ClientID = "Client"
        console.log("Received Message sending modify request.");
        transaction.modify(msg).then(_ => {
            console.log(msg);
        });
    }
}

function errorHandler(msg) {
    console.log(`Received error ${msg}`);
}

transaction.receive(5, 10, queueHandler, errorHandler);
