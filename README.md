# Nodejs

The **KubeMQ SDK for Nodejs** enables Nodejs developers to communicate with [KubeMQ](https://kubemq.io/) server.

## Table of Content
[[toc]]

## General SDK description
The SDK implements all communication patterns available through the KubeMQ server:
- Events
- EventStore
- Command
- Query
- Queue


### Installation

The recommended way to use the SDK for Nodejs in your project is to consume it from NPM
https://www.npmjs.com/package/kubemq-nodejs

## Configurations
The only required configuration setting is the KubeMQ server address.

Configuration can be set by using Environment Variable:

### Configuration via Environment Variable
Set `KubeMQServerAddress` to the KubeMQ Server Address


### Configuration via code
When setting the KubeMQ server address within the code, simply pass the address as a parameter to the various constructors.
See exactly how in the code examples in this document.

## Generating Documentation


## Running the examples.

The [examples](https://github.com/kubemq-io/kubemq-node/tree/master/examples)
are standalone projects that showcase the usage of the SDK.

To run the examples, you need to have a running instance of KubeMQ.


## Main Concepts.

- Metadata: The metadata allows us to pass additional information with the event. It can be in any form that can be presented as a string, i.e., struct, JSON, XML, and many more.
- Body: The actual content of the event. It can be in any form that is serializable into a byte array, i.e., string, struct, JSON, XML, Collection, binary file, and many more.
- ClientID: Displayed in logs, tracing, and KubeMQ dashboard(When using Events Store, it must be unique).
- Tags: Set of Key value pair that help categorize the message

### Event/EventStore/Command/Query.

- Channel: Represents the endpoint target. One-to-one or one-to-many. Real-Time Multicast.
- Group: Optional parameter when subscribing to a channel. A set of subscribers can define the same group so that only one of the subscribers within the group will receive a specific event. Used mainly for load balancing. Subscribing without the group parameter ensures receiving all the channel messages. (When using Grouping all the programs that are assigned to the group need to have to same channel name)
- Event Store: The Event Store represents a persistence store, should be used when need to store data on a volume. 
### Queue

- Queue: Represents a unique FIFO queue name, used in queue pattern.
- Transaction: Represents an Rpc stream for single message transaction.


### Event/EventStore/Command/Query SubscribeRequest Object:

A struct that is used to initialize SubscribeToEvents/SubscribeToRequest, the SubscribeRequest contains the following:

- SubscribeType - Mandatory - Enum that represents the subscription type.
- Events - if there is no need for Persistence.
- EventsStore - If you want to receive Events from persistence. See the Main concepts.
- Command - Should be used when a response is not needed.
- Query - Should be used when a response is needed.
- ClientID - Mandatory - See Main concepts.
- Channel - Mandatory - See Main concepts.
- Group - Optional - See Main concepts.
- EventsStoreType - Mandatory - set the type event store to subscribe to Main concepts.

## Queue.

KubeMQ supports distributed durable FIFO based queues with the following core features:

- Exactly One Delivery - Only one message guarantee will deliver to the subscriber.
- Single and Batch Messages Send and Receive - Single and multiple messages in one call.
- RPC and Stream Flow - RPC flow allows an insert and pulls messages in one call. Streamflow allows single message consuming in a transactional way.
- Message Policy - Each message can be configured with expiration and delay timers. Also, each message can specify a dead-letter queue for un-processed messages attempts.
- Long Polling - Consumers can wait until a message available in the queue to consume.
- Peak Messages - Consumers can peak into a queue without removing them from the queue.
- Ack All Queue Messages - Any client can mark all the messages in a queue as discarded and will not be available anymore to consume.
- Visibility timers - Consumers can pull a message from the queue and set a timer, which will cause the message not to be visible to other consumers. This timer can be extended as needed.
- Resend Messages - Consumers can send back a message they pulled to a new queue or send a modified message to the same queue for further processing.

### Send Message to a Queue

```Nodejs
let channelName     =     "queue";
let kubemqAdd       =      "localhost:50000";
let message_queue   =     new MessageQueue(kubemqAdd,channelName,"transaction");


let bytes               =     [];

for(let i = 0; i < "myQueueTestMessage".length; i++) {
    let char              =    "TestBody".charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
}

let tags           =    [];
tags[ 'key3' ]     =    "value3";
tags[ 'key2' ]     =    "value2";


let message          =     new msgQueue.Message("FirstMessage",bytes,tags);

    message_queue.sendQueueMessage(message).then(messageQueueResponse =>{
        let messagesRemaining     =   messages.length;
        console.log(`finished sending batch ${messagesRemaining} messages`);
    });
```    

 ### Send Message to a Queue with Expiration 

```Nodejs
      let bytes               =     [];

      for(let i = 0; i < "myQueueTestMessage".length; i++) {
        let char              =    "TestBody".charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
      }

      let tags = [];
      tags[ 'key3' ] = "value3";
      tags[ 'key2' ] = "value2";
      
        let channelName     =     "queue";
        let kubemqAdd       =      "localhost:50000";
        let message_queue   =     new MessageQueue(kubemqAdd,channelName,"transaction");
        let message          =     new msgQueue.Message("MyQueueSendReceive",bytes,tags);
            message_queue.sendQueueMessage(message).then(messageResponse =>{
              console.log(messageResponse);
              });

```

### Send Message to a Queue with Delay

```Nodejs
      let bytes               =     [];

      for(let i = 0; i < "myQueueTestMessage".length; i++) {
        let char              =    "TestBody".charCodeAt(i);
        bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
      }

      let tags = [];
      tags[ 'key3' ] = "value3";
      tags[ 'key2' ] = "value2";
      
        let channelName     =     "queue";
        let kubemqAdd       =      "localhost:50000";
        let message_queue   =     new MessageQueue(kubemqAdd,channelName,"transaction");

        let message          =     new msgQueue.Message("MyQueueSendReceive",bytes,tags);
        message.addDelay(3);
            message_queue.sendQueueMessage(message).then(messageResponse =>{
              console.log(messageResponse);
              });
```


### Send Batch Messages

```Nodejs
  let channelName     =     "test-batch-queue";
        let kubemqAdd       =      "localhost:50000";
        let bytes               =     [];
        let messages_to_send    =      5;
        for(let i = 0; i < "myQueueTestMessage".length; i++) {
          let char              =    "TestBody".charCodeAt(i);
          bytes.push(char >>> 8);
          bytes.push(char & 0xFF);
        }

        let tags             =   [];
        tags[ 'key3' ]       =   "value3";
        tags[ 'key2' ]       =   "value2";

        let message_queue    =     new MessageQueue(kubemqAdd,channelName,"my-batch-queue");
        //Send to channel test-kube with no store
        let messageArray     =   [];
        for (let index = 0; index < messages_to_send; index++) {
            let message      =     new msgQueue.Message(`batch-Request-number:${index}`,bytes,tags);
            messageArray.push(message);
        }
        message_queue.sendQueueMessageBatch(messageArray).then(batchResponse =>{
            console.log(batchResponse);
        });
```

### Receive Messages from a Queue

```Nodejs
        let channelName     =     "test-receive-queue";
        let kubemqAdd       =      "localhost:50000";
        let message_queue    =     new MessageQueue(kubemqAdd,channelName,"my-receive-queue");

      message_queue.receiveQueueMessages(1,2).then(receiveResponse =>{
          receiveResponse.Messages.forEach(element => {
              console.log(element);
          });
      });
```

### Peek Messages from a Queue

```Nodejs
let channelName     =     "test-peek-queue";
let kubemqAdd       =      "localhost:50000";
let message_queue    =     new MessageQueue(kubemqAdd,channelName,"my-peek-queue");
 message_queue.peekQueueMessage(1,1).then(peekResponse =>{
              console.log(peekResponse);
          });     
```
### Ack All Messages In a Queue

```Nodejs
  let channelName     =     "test-peek-queue";
  let kubemqAdd       =       "localhost:50000";
 let message_queue    =     new MessageQueue(kubemqAdd,channelName,"my-peek-queue");
            message_queue.ackAllQueueMessages().then(ackAllResponse =>{
              console.log(ackAllResponse);
      });
```

### Transactional Queue - Ack and reject
```Nodejs
    let channelName = "transaction-queue";
    let kubemqAdd = "localhost:50000";
    let message_queue = new MessageQueue(kubemqAdd, channelName, "my-transaction");


    let transaction = message_queue.createTransaction();




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
      });
```


### Transactional Queue - Extend Visibility

```Nodejs
    let channelName = "transaction-queue";
    let kubemqAdd = "localhost:50000";
    let message_queue = new MessageQueue(kubemqAdd, channelName, "my-transaction");


    let transaction      =     message_queue.createTransaction();

    function queueHandler(recm) {
        console.log(`Received messages ${recm}`);
        if (recm.StreamRequestTypeData=="ReceiveMessage")
        {
          console.log("Need more time to process, extend visibility for more 3 seconds");
          transaction.extendVisibility(100).then(_=> {
            console.log(`sent extendVisibiltyRequest`);
          });
        }
    }


      transaction.receive(5, 10,queueHandler);
        

```

### Transactional Queue - Resend to New Queue

```Nodejs

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
```

### Transactional Queue - Resend Modified Message
```Nodejs
let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new MessageQueue(kubemqAdd, channelName, "my-resend");


let transaction      =     message_queue.createTransaction();

function queueHandler(recm) {
    console.log(`Received messages ${recm}`);
    if (recm.StreamRequestTypeData=="ReceiveMessage")
    {
      console.log("Received Message sending resend request.");
      transaction.resend("new Queue").then(_=> {
        console.log(`sent resend`);
      });
    }
}


  transaction.receive(5, 10,queueHandler);
```

## Event
### Sending Events


#### Single event
```Nodejs
let pub = new publish.Publisher('localhost', '50000', 'pub', 'pubsub');

let event = new publish.Event(byteConverter.stringToByte('test'));

pub.send(event).then(res => {
    console.log(res);
});


```

#### Stream Events
```Nodejs

let kubemqAdd = "localhost:50000";

const sender          =   require('../pubSub/lowLevel/sender');
const events          =   require('events');
const lowLevelEvent   =   require('../pubSub/lowLevel/event')

let channelName            =      "test-event-stream";
let send                =      new sender(kubemqAdd);
let bytes = [];

for (let i = 0; i < "myTestStream".length; i++) {
  let char = "TestBody".charCodeAt(i);
  bytes.push(char >>> 8);
  bytes.push(char & 0xFF);
}

let eventEmmiter = new events.EventEmitter();


send.streamEvent(eventEmmiter)
console.log('test')
for (let i = 1; i < 5; i++) {
  let event= new lowLevelEvent(bytes);
  event.Channel = "test-channel";
  event.ClientID ="MyID";
  eventEmmiter.emit('message',event)
  
}
```

### Receiving Events

```Nodejs
var subscriber = require('../pubSub/events/subscriber');
let sub = new subscriber.Subscriber('localhost', '50000', 'sub', 'pubsub');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => { console.log('error:' + err) })


```

## Event Store

### Subscription Options  

KubeMQ supports six types of subscriptions:  

- StartFromNewEvents - start event store subscription with only new events  

- StartFromFirstEvent - replay all the stored events from the first available sequence and continue stream new events from this point  

- StartFromLastEvent - replay the last event and continue stream new events from this point  

- StartFromSequence - replay events from specific event sequence number and continue stream new events from this point  

- StartFromTime - replay events from specific time continue stream new events from this point  

- StartFromTimeDelta - replay events from specific current time - delta duration in seconds, continue stream new events from this point  
### Sending Event Store

#### Single Event Store

```Nodejs
var storePublish = require('../pubSub/eventsStore/StorePublisher');
let storePub = new storePublish.StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new storePublish.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});
```

### Receiving Events Store

```Nodejs
  var storeSubscriber = require('../pubSub/eventsStore/StoreSubscriber');
let storeSub = new storeSubscriber.StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => { 
    console.log('msg:' + msg.Metadata) }
    , err => { console.log('error:' + err) },
    storeSubscriber.EventStoreType.StartFromFirst);
```

## Commands

### Concept

Commands implement the synchronous messaging pattern in which the sender sends a request and waits for a specific amount of time to get a response.  
The response can be successful or not. This is the responsibility of the responder to return with the result of the command within the time the sender set in the request.  

#### Receiving Commands Requests  
```Nodejs
  var commandReceiver = require('../rpc/command/commandReceiver');


var cmdRes = new commandReceiver.CommandReceiver('localhost', '50000', 'cc', 'cmd');
cmdRes.subscribe(cmd => {
    console.log(cmd);

    let respond = new commandReceiver.Response(cmd);
    respond.Executed = true;
    cmdRes.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(err => console.log(err));

}, err => {
    console.log(err);
}
)
```

### Sending Command Request

```Nodejs
var byteConv = require('../tools/stringToByte');

const commandSender = require('../rpc/command/commandSender');

var sender = new commandSender.CommandSender('localhost', '50000', 'cc1', 'cmd', 10000);

var request = new commandSender.CommandRequest(byteConv.stringToByte(''));

sender.send(request).then(
  
    res => { console.log(res.Executed) });
```

### Sending Command Request Async  

```Nodejs
  var byteConv = require('../tools/stringToByte');

const commandSender = require('../rpc/command/commandSender');

var sender = new commandSender.CommandSender('localhost', '50000', 'cc1', 'cmd', 10000);

var request = new commandSender.CommandRequest(byteConv.stringToByte(''));

sender.send(request).then(
  
    res => { console.log(res.Executed) });
```

## Queries

### Concept

Queries implement the synchronous messaging pattern in which the sender sends a request and waits for a specific amount of time to get a response.  

The response must include metadata or body together with an indication of successful or not operation. This is the responsibility of the responder to return with the result of the query within the time the sender set in the request.

### Receiving Query Requests

```Nodejs
  var qryResClass = require('../rpc/query/queryReceiver');

var byteConv = require('../tools/stringToByte');

var query = new qryResClass.QueryReceiver('localhost', '50000', 'cc', 'qry', undefined, 10000);
query.subscribe(qry => {
    console.log(qry);
    

    var respond = new qryResClass.QueryResponse(qry, byteConv.stringToByte('result:123')
    )
    query.sendResponse(respond).then(snd => {
        console.log('sent:' +snd);
    }).catch(cht => console.log(cht));

}, err => {
    console.log(err);
}
)

```

### Sending Query Requests

```Nodejs
 
var qrySendClass = require('../rpc/query/querySender');
var qrySend = new qrySendClass.QuerySender('localhost', '50000', 'cc1', 'qry', 10000);

var request = new qrySendClass.QueryRequest('ff');



qrySend.send(request).then(res => {
     console.log(res) });
```
