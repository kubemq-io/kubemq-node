const MessageQueue = require('../queue/message_queue');
const msgQueue     = require('../queue/message');

let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new MessageQueue(kubemqAdd, channelName, "my-transaction");


let bytes               =     [];

for(let i = 0; i < "myQueueTestMessage".length; i++) {
  let char              =    "TestBody".charCodeAt(i);
  bytes.push(char >>> 8);
  bytes.push(char & 0xFF);
}

let tags             =    [];
tags[ 'key3' ]       =    "value3";
tags[ 'key2' ]       =    "value2";

let messages         =     [];
let message          =     new msgQueue.Message("MyFirstMessage",bytes,tags);
let second_message   =     new msgQueue.Message("MySecondMessage",bytes,tags);

messages.push(message);
messages.push(second_message);
message_queue.ackAllQueueMessages().then(_=>{
  let transaction      =     message_queue.createTransaction();

  function queueHandler(recm) {
      console.log(`Received messages ${recm}`);
      if (recm.StreamRequestTypeData=="ReceiveMessage")
      {
        console.log("Need more time to process, extend visibility for more 3 seconds");
        transaction.extendVisibility(3).then(_=> {
          console.log(`sent extendVisibiltyRequest`);
        });
      }
  }

  message_queue.sendQueueMessageBatch(messages).then(messagesResponse=>{
    transaction.receive(5, 10,queueHandler);
      
  });
})