const MessageQueue = require('../queue/message_queue');
const msgQueue = require('../queue/message');

let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new MessageQueue(kubemqAdd, channelName, "my-transaction");

message_queue.ackAllQueueMessages().then(ackAllResponse =>{
    let bytes = [];

  for (let i = 0; i < "myQueueTestMessage".length; i++) {
    let char = "TestBody".charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
  }



  let messages = [];
  let message = new msgQueue.Message("MyFirstMessage", bytes);
  let second_message = new msgQueue.Message("MySecondMessage", bytes);

  messages.push(message);
  messages.push(second_message);

  message_queue.sendQueueMessageBatch(messages);
  console.log("batch messages were sent");

  message_queue.peekQueueMessage().then(response=>{
    if (response.Messages.length===2){
      console.log("2 messages were sent");
      response.Messages.forEach(message => {
        console.log(`Message Receive: ${message.Metadata} on messageID : ${message.MessageID}`);
      });
    }
    else{
      console.log("more than 2 messages were sent", response.Messages.length);
    }
  });

});
