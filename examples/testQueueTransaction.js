const MessageQueue = require('../queue/message_queue');
const msgQueue = require('../queue/message');

let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new MessageQueue(kubemqAdd, channelName, "my-transaction");

message_queue.ackAllQueueMessages().then( _ =>{
    let bytes = [];

    for (let i = 0; i < "myQueueTestMessage".length; i++) {
      let char = "TestBody".charCodeAt(i);
      bytes.push(char >>> 8);
      bytes.push(char & 0xFF);
    }

    let transaction = message_queue.createTransaction();

    let messages = [];
    let message = new msgQueue.Message("MyFirstMessage", bytes);
    let second_message = new msgQueue.Message("MySecondMessage", bytes);
  
    messages.push(message);
    messages.push(second_message);
  
    message_queue.sendQueueMessageBatch(messages).then(_=>{
      transaction.receive(100, 1, queueHandler);


      function queueHandler(recm) {
        console.log(`Received messages ${recm}`);
        if (recm.StreamRequestTypeData == "ReceiveMessage") {
    
          let msgSequence = recm.Message.Attributes.Sequence;
          workOnMSG(recm)
            .then(_ => {
              transaction.ackMessage(msgSequence)
                .then(_ => {
                  console.log("ack was called");
                }
                )
            }).catch(_ => {
              transaction.rejectedMessage(msgSequence)
                .then(_ => {
                  console.log('msg was rejected');
                });
            });
        }
        else if (recm.StreamRequestTypeData === "AckMessage" || recm.StreamRequestTypeData === "RejectMessage") {
          console.log('msg acked, stream was close');
          transaction.closeStream();
        }
    
      }
    
      function workOnMSG(msg) {
        return new Promise((resolve, reject) => {
          if (msg.Message.Attributes.Sequence !== '3') {
            console.log('worked on msg');
            resolve();
          }
          else {
            reject();
          }
        })
      };
    });



})








