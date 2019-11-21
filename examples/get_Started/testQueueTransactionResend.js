const MessageQueue = require('../../queue/message_queue');
const msgQueue     = require('../../queue/message');
let channelName   = 'hello-world-queue';
let message_queue = new MessageQueue('localhost:50000', channelName,'test-queue-client-id1');


let transaction      =     message_queue.createTransaction();

function queueHandler(msg) {
    console.log(`Received messages ${msg}`);
    if (msg.StreamRequestTypeData=="ReceiveMessage")
    {
      console.log("Received Message sending resend request.");
      transaction.resend(channelName).then(_=> {
        console.log(`sent resend`);
      });
    }
}

function errorHandler(msg) {
  console.log(`Received error ${msg}`);
};

  transaction.receive(5, 10,queueHandler,errorHandler);
