const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue   =     new kubemq.MessageQueue('localhost:50000','testQueue','client',32,1,jwt_token);

        message_queue.peekQueueMessage().then(receivedMessages=>{
            receivedMessages.Messages.forEach(element => {               
                console.log('peek message:'+ kubemq.byteToString(element.Body));
            })         
});

