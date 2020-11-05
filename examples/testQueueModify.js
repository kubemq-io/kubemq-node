const kubemq = require('../kubemq');

let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'Client');


let transaction = message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${JSON.stringify(msg.Message)}`);
    if (msg.StreamRequestTypeData === "ReceiveMessage") {
        msg.Metadata = "new meta data";
        msg.Channel = "testQueue";
        msg.ClientID = "Client";
        msg.Body = kubemq.stringToByte("my new body");
        console.log("Received Message sending modify request.");
        transaction.modify(msg).then(_ => {
            console.log('Body:' + kubemq.byteToString(msg.Message.Body));
        });
    }
}

function errorHandler(msg) {
    console.log(`Received error ${JSON.stringify(msg)}`);
}

transaction.receive(5, 10, queueHandler, errorHandler);
