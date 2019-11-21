const MessageQueue  = require('../../queue/message_queue');
const msgQueue      = require('../../queue/message');
const byteConverter = require('../../tools/stringToByte').stringToByte;

let message_queue   =     new MessageQueue('localhost:50000','hello-world-queue','test-queue-client-id1');


let messages         =     [
    new msgQueue('meta', byteConverter('ms1')),
    new msgQueue('meta2',byteConverter('body2'))
];

//1. purge the queue
message_queue.ackAllQueueMessages().then(ackAllResponse =>{
    console.log("called ack all")
    //2. send batch messages
    message_queue.sendQueueMessageBatch(messages).then(messageQueueResponse =>{
        console.log(`finished sending batch ${messageQueueResponse.MessagesResponse.length} messages`);        
        //3. receive messages
        message_queue.receiveQueueMessages(1,1).then(receivedMessages=>{
           console.log(`received total of ${receivedMessages.MessagesReceived}, will peek to see queue status`);
           //4. peek queue status
            message_queue.peekQueueMessage(10,1).then(peekResult =>{
                console.log(`peek result returned :${peekResult.MessagesReceived} messages out of ${messageQueueResponse.MessagesResponse.length} that was left`);
            })
        })
    })
})
