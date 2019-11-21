const MessageQueue = require('../../queue/message_queue');
const msgQueue     = require('../../queue/message');
const byteConverter = require('../../tools/stringToByte').stringToByte;

let message_queue = new MessageQueue('localhost:50000', 'hello-world-queue','test-queue-client-id1');


  let transaction      =     message_queue.createTransaction();

  function queueHandler(msg) {
      console.log(`Received messages ${msg.StreamRequestTypeData}`);
      if (msg.StreamRequestTypeData=="ReceiveMessage")
      {
        console.log("Need more time to process, extend visibility for more 3 seconds");
        transaction.extendVisibility(3).then(_=> {
          console.log(`sent extendVisibilityRequest`);
        });
      }
  }

  function errorHandler(msg) {
    console.log(`Received error ${msg}`);
  };
    transaction.receive(5, 10,queueHandler,errorHandler);
