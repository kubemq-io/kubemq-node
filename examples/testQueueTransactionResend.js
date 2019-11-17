const MessageQueue = require('../queue/message_queue');
const msgQueue     = require('../queue/message');

let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new MessageQueue(kubemqAdd, channelName, "my-resend");


let transaction      =     message_queue.createTransaction();

function queueHandler(recm) {
    console.log(`Received messages ${recm}`);
    if (recm.StreamRequestTypeData=="ReceiveMessage")
    {
      console.log("Received Message sending resend request.");
      transaction.resend(channelName).then(_=> {
        console.log(`sent resend`);
      });
    }
}


  transaction.receive(5, 10,queueHandler);
