const MessageQueue = require('../../queue/message_queue');
let message_queue   =     new MessageQueue('localhost:50000','hello-world-queue','test-queue-client-id1');

        message_queue.peekQueueMessage().then(receivedMessages=>{
            receivedMessages.Messages.forEach(element => {               
                console.log('peek message:'+element);
            })         
});

