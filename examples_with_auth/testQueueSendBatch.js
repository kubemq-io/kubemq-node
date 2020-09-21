const kubemq = require('../kubemq');

let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client',32,1,jwt_token);

let messages = [];
for (let index = 0; index < 20; index++) {
   messages.push(new kubemq.Message(`MyMessage:${index}`, kubemq.stringToByte(`Message body:${index}`)));
}

message_queue.sendQueueMessageBatch(messages).then(res => {
   console.log(res)
}).catch(err => {
   console.log('message send QueueMessage Batch error, error:' + err);
});
console.log("batch messages were sent");
