const kubemq = require('../kubemq');
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');


let messages = [
    new kubemq.Message('meta', kubemq.stringToByte('ms1')),
    new kubemq.Message('meta2', kubemq.stringToByte('body2'))
];

//1. purge the queue
message_queue.ackAllQueueMessages().then(ackAllResponse => {
    console.log("called ack all")
    //2. send batch messages
    message_queue.sendQueueMessageBatch(messages).then(messageQueueResponse => {

        console.log(`finished sending batch ${messageQueueResponse.MessagesResponse.length} messages`);
        //3. receive messages
        console.log(`finished sending batch ${messageQueueResponse.MessagesResponse.length} messages`);
        //4. peek queue status
        message_queue.peekQueueMessage(10, 1).then(peekResult => {

            console.log(`peek result returned :${peekResult.MessagesReceived} messages out of ${messageQueueResponse.MessagesResponse.length} that was left`);

        })
    })
})

