const MessageQueue = require('../queue/message_queue');
const msgQueue     = require('../queue/message');

let channelName     =     "queue";
let kubemqAdd       =	  "localhost:50000";
let message_queue   =     new MessageQueue(kubemqAdd,channelName,"transaction");


let bytes               =     [];

for(let i = 0; i < "myQueueTestMessage".length; i++) {
    let char              =    "TestBody".charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
}

let tags           =    [];
tags[ 'key3' ]     =    "value3";
tags[ 'key2' ]     =    "value2";

let messages         =     [];
let message          =     new msgQueue.Message("FirstMessage",bytes,tags);
let second_message   =     new msgQueue.Message("SecondMessage",bytes,tags);

messages.push(message);
messages.push(second_message);
message_queue.ackAllQueueMessages().then(ackAllResponse =>{
    console.log("called ack all")
    message_queue.sendQueueMessageBatch(messages).then(messageQueueResponse =>{
        let messagesRemaining     =   messages.length;
        console.log(`finished sending batch ${messagesRemaining} messages`);
        message_queue.receiveQueueMessages(1,1).then(receivedMessages=>{
            receivedMessages.Messages.forEach(element => {
                messagesRemaining =-     -1;
                console.log(`received message: ${element} still got ${messagesRemaining} left`);
            })
            message_queue.peekQueueMessage(10,1).then(peekResult =>{
                console.log(`peek result returned :${peekResult.Messages.length} messages out of ${messagesRemaining} that was left`);
            })
        })
    })
})
