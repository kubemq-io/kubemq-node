const kubemq = require('../kubemq');


let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client', 32, 1, jwt_token);


let transaction = message_queue.createTransaction();
transaction.receive(100, 1, queueHandler, errorHandler)

function queueHandler(msg) {
    console.log(`Received messages ${msg.StreamRequestTypeData}`);
    if (msg.StreamRequestTypeData === "ReceiveMessage") {
        if (msg.IsError === false) {
            let msgSequence = msg.Message.Attributes.Sequence;
            workOnMSG(msg).then(_ => {
                transaction.ackMessage(msgSequence).then(_ => {
                        console.log("ack was called");
                    }
                )
            }).catch(_ => {
                transaction.rejectedMessage(msgSequence).then(_ => {
                    console.log('msg was rejected');
                });
            });
        } else {
            console.log(`Received error of ${msg.Error}`);
        }
    } else if (msg.StreamRequestTypeData === "AckMessage" || msg.StreamRequestTypeData === "RejectMessage") {
        transaction.closeStream().then(r => {
                console.log('msg Ack, stream was close');
            }
        );

        //loop a a long pool request.
        transaction = message_queue.createTransaction();
        transaction.receive(100, 1, queueHandler, errorHandler)
    }
}

function errorHandler(msg) {
    console.log(`Received error ${msg}`);
}

function workOnMSG(msg) {
    return new Promise((resolve, reject) => {
        if (msg.Message.Attributes.Sequence !== '3') {
            console.log('worked on msg');
            resolve();
        } else {
            reject();
        }
    });
}
