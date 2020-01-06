const kubemq = require('../kubemq');


let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');

let messages = [];
for (let index = 0; index < 20; index++) {
   messages.push(new kubemq.Message(`MyMessage:${index}`, kubemq.stringToByte(`Message body:${index}`)));
}

message_queue.sendQueueMessageBatch(messages).then(res => {
   console.log(res)
});
console.log("batch messages were sent");
