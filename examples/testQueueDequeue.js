
const kubemq = require('../kubemq');
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');

message_queue.receiveQueueMessages().then(receivedMessages => {
    receivedMessages.Messages.forEach(element => {
        console.log('received message:' + kubemq.byteToString(element.Body));
    })
}).catch(err => {
    console.log('message  receive Queue Messages Request  error, error:' + err);
});

