const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue   =     new kubemq.MessageQueue('localhost:50000','testQueue','client',32,1,jwt_token);

        message_queue.receiveQueueMessages().then(receivedMessages=>{
            receivedMessages.Messages.forEach(element => {               
                console.log('received message:'+ kubemq.byteToString(element.Body));
            })         
}).catch(err => {
    console.log('message receive Queue Messages error, error:' + err);
});

