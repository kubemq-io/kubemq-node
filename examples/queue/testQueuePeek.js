const kubemq = require('../../kubemq');

let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');

message_queue.peekQueueMessage().then(receivedMessages => {
    receivedMessages.Messages.forEach(element => {
        console.log('peek message:' + kubemq.byteToString(element.Body));
    })
}).catch(err => {
    console.log('message  peek Queue Messages Request  error, error:' + err);
});

