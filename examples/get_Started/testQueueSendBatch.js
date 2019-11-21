const MessageQueue = require('../../queue/message_queue');
var Message = require('../../queue/message');
const byteConverter = require('../../tools/stringToByte').stringToByte;

let message_queue = new MessageQueue('localhost:50000','hello-world-queue','test-queue-client-id1');


  let messages = [];
  for (let index = 0; index < 20; index++) {
   

   messages.push(new Message(`MyMessage:${index}`, byteConverter(`Message body:${index}`)));
  } 
  
  message_queue.sendQueueMessageBatch(messages).then(res =>
     console.log(res));
  console.log("batch messages were sent");
