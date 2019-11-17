var Rx= require('rxjs')
var Channel  = require('./commandquery/channel')
var Request = require('./commandquery/request')
var ChannelParameters = require('./commandquery/channel_parameters')
const RequestType = require('./commandquery/request_type')
const utf8 = require('utf8');
var MessageQueue = require('./queue/message_queue')
var Message      = require('./queue/message')

var main=()=> {
  let channelName         =     "index-23test-kube";
  let kubemqAdd           =     "localhost:50000";
  let bytes               =     [];

  for(let i = 0; i < "TestBody".length; i++) {
      let char = "TestBody".charCodeAt(i);
      bytes.push(char >>> 8);
      bytes.push(char & 0xFF);
  }


  let message_queue   =     new MessageQueue(kubemqAdd,channelName,"my-index-queue");
  let message      =     new Message.Message(`test-trans`,bytes);
  function receiveMessage(params) {
    console.log(params);
  }
  message_queue.sendQueueMessage(message).then(res=>{
    console.log(res);
    let trans           =     message_queue.createTransaction();
    trans.receive(8,3,receiveMessage)

  })

      
}

// var client = new kubeProto.service.kubemq('localhost:50000',
// grpc.credentials.createInsecure());
main();