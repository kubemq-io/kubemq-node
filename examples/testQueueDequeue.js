const MessageQueue = require('../queue/message_queue');
let message_queue   =     new MessageQueue('localhost:50000','testQueue','client');

        message_queue.receiveQueueMessages().then(receivedMessages=>{
            receivedMessages.Messages.forEach(element => {               
                console.log('received message:'+element);
            })         
});

