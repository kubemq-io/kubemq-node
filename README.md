# KubeMQ Node.js
The **KubeMQ SDK for Node.js** enables Node.js developers to communicate with [KubeMQ](https://kubemq.io/) server.

## General SDK description
The SDK implements all communication patterns available through the KubeMQ server:
- Events
- EventStore
- Command
- Query
- Queue

### Installation
The recommended way to use the SDK for Node.js in your project is to consume it from NPM
https://www.npmjs.com/package/kubemq-nodejs

## Configurations
The only required configuration setting is the KubeMQ server address.

Configuration can be set by using Environment Variable:

### Configuration via Environment Variable
Set `KubeMQServerAddress` to the KubeMQ server address.

To use TLS you need to make sure `KubeMQCertificateFile` is filled with the correct path to the certificate file,
If you are not using Secured connection please do not fill this env var.

### Configuration via code
When setting the KubeMQ server address within the code, simply pass the address as a parameter to the various constructors.
See exactly how in the code examples in this document.

[comment]: <> (TODO: ## Generating Documentation)

## Running the examples.
The [examples](https://github.com/kubemq-io/kubemq-node/tree/master/examples)
are standalone projects that showcase the usage of the SDK.

To run the examples, you need to have a running instance of KubeMQ.

## Main Concepts
- Metadata: The metadata allows us to pass additional information with the event. It can be in any form that can be presented as a string, i.e., struct, JSON, XML, and many more.
- Body: The actual content of the event. It can be in any form that is serializable into a byte array, i.e., string, struct, JSON, XML, Collection, binary file, and many more.
- ClientID: Displayed in logs, tracing, and KubeMQ dashboard(When using Events Store, it must be unique).
- Tags: Set of Key value pair that help categorize the message

### Event/EventStore/Command/Query
- Channel: Represents the endpoint target. One-to-one or one-to-many. Real-Time Multicast.
- Group: Optional parameter when subscribing to a channel. A set of subscribers can define the same group so that only one of the subscribers within the group will receive a specific event. Used mainly for load balancing. Subscribing without the group parameter ensures receiving all the channel messages. (When using Grouping all the programs that are assigned to the group need to have to same channel name)
- Event Store: The Event Store represents a persistence store, should be used when need to store data on a volume. 

### Queue
- Queue: Represents a unique FIFO queue name, used in queue pattern.
- Transaction: Represents an Rpc stream for single message transaction.


### Event/EventStore/Command/Query SubscribeRequest Object:
A struct that is used to initialize SubscribeToEvents/SubscribeToRequest, the SubscribeRequest contains the following:
- SubscribeType – Mandatory – Enum that represents the subscription type.
- Events – if there is no need for Persistence.
- EventsStore – If you want to receive Events from persistence. See the Main concepts.
- Command – Should be used when a response is not needed.
- Query – Should be used when a response is needed.
- ClientID – Mandatory – See Main concepts.
- Channel – Mandatory – See Main concepts.
- Group – Optional – See Main concepts.
- EventsStoreType – Mandatory – set the type event store to subscribe to Main concepts.

## Queue
KubeMQ supports distributed durable FIFO based queues with the following core features:
- Exactly One Delivery – Only one message guarantee will deliver to the subscriber.
- Single and Batch Messages Send and Receive – Single and multiple messages in one call.
- RPC and Stream Flow – RPC flow allows an insert and pulls messages in one call. Streamflow allows single message consuming in a transactional way.
- Message Policy – Each message can be configured with expiration and delay timers. Also, each message can specify a dead-letter queue for un-processed messages attempts.
- Long Polling – Consumers can wait until a message available in the queue to consume.
- Peak Messages – Consumers can peak into a queue without removing them from the queue.
- Ack All Queue Messages – Any client can mark all the messages in a queue as discarded and will not be available anymore to consume.
- Visibility timers – Consumers can pull a message from the queue and set a timer, which will cause the message not to be visible to other consumers. This timer can be extended as needed.
- Resend Messages – Consumers can send back a message they pulled to a new queue or send a modified message to the same queue for further processing.


## QueueMessageAttributes.(proto struct)
- Timestamp – when the message arrived to queue.
- Sequence – the message order in the queue.
- MD5OfBody – An MD5 digest non-URL-encoded message body string.
- ReceiveCount – how many recieved.
- ReRouted – if the message was ReRouted from another point.
- ReRoutedFromQueue – from where the message was ReRouted
- ExpirationAt – Expiration time of the message.
- DelayedTo -if the message was Delayed.

```
message QueueMessageAttributes {
    int64               Timestamp                   =1;
    uint64              Sequence                    =2;
    string              MD5OfBody                   =3;
    int32               ReceiveCount                =4;
    bool                ReRouted                    =5;
    string              ReRoutedFromQueue           =6;
    int64               ExpirationAt                =7;
    int64               DelayedTo                   =8;
}
```

### Send Message to a Queue
```JavaScript
const kubemq = require('kubemq-nodejs')

let channelName = 'queue';
let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'transaction');

let bytes = kubemq.stringToByte('TestBody')

let tags = [];
tags['key3'] = 'value3';
tags['key2'] = 'value2';

let message = new kubemq.Message('FirstMessage', bytes, tags);

message_queue.sendQueueMessage(message).then(messageQueueResponse => {
  console.log(`finished sending message ${message} messages response ${messageQueueResponse}`);
});
```

 ### Send Message to a Queue with Expiration 
```JavaScript
const kubemq = require('kubemq-nodejs')

let bytes = kubemq.stringToByte('TestBody')
let tags = [];
tags['key3'] = 'value3';
tags['key2'] = 'value2';

let channelName = 'queue';
let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'transaction');
let message = new kubemq.Message('MyQueueSendReceive', bytes, tags);
message_queue.sendQueueMessage(message).then(messageResponse => {
  console.log(messageResponse);
});
```

### Send Message to a Queue with Delay
```JavaScript
const kubemq = require('kubemq-nodejs')

let bytes = kubemq.stringToByte('TestBody')

let tags = [];
tags['key3'] = 'value3';
tags['key2'] = 'value2';

let channelName = 'queue';
let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'transaction');

let message = new kubemq.Message('MyQueueSendReceive', bytes, tags);
message.addDelay(3);
message_queue.sendQueueMessage(message).then(messageResponse => {
  console.log(messageResponse);
});
```


### Send Batch Messages
```JavaScript
const kubemq = require('kubemq-nodejs')

let bytes = kubemq.stringToByte('TestBody')

let tags = [];
tags['key3'] = 'value3';
tags['key2'] = 'value2';

let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'my-batch-queue');
//Send to channel test-kube with no store
let messageArray = [];
for (let index = 0; index < messages_to_send; index++) {
  let message = new kubemq.Message(`batch-Request-number:${index}`, bytes, tags);
  messageArray.push(message);
}
message_queue.sendQueueMessageBatch(messageArray).then(batchResponse => {
  console.log(batchResponse);
});
```

### Receive Messages from a Queue
```JavaScript
const kubemq = require('kubemq-nodejs')

let channelName = 'test-receive-queue';
let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'my-receive-queue');

message_queue.receiveQueueMessages(1, 2).then(receiveResponse => {
  receiveResponse.Messages.forEach(element => {
    console.log(element);
  });
});
```

### Peek Messages from a Queue

```JavaScript
const kubemq = require('kubemq-nodejs')
let channelName = 'test-peek-queue';

let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'my-peek-queue');
message_queue.peekQueueMessage(1, 1).then(peekResponse => {
  console.log(peekResponse);
}); 
```
### Ack All Messages In a Queue

```JavaScript
const kubemq = require('kubemq-nodejs')
let channelName = 'test-peek-queue';
let kubemqAdd = 'localhost:50000';
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, 'my-peek-queue');
message_queue.ackAllQueueMessages().then(ackAllResponse => {
  console.log(ackAllResponse);
});
```

### Transactional Queue – Ack and reject
```JavaScript
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');
let transaction = message_queue.createTransaction();
transaction.receive(100, 1, queueHandler, errorHandler)

function queueHandler(msg) {
  console.log(`Received messages ${msg.StreamRequestTypeData}`);
  if (msg.StreamRequestTypeData == 'ReceiveMessage') {
    if (msg.IsError === false) {
      let msgSequence = msg.Message.Attributes.Sequence;
      workOnMSG(msg).then(_ => {
        transaction.ackMessage(msgSequence).then(_ => {
            console.log('ack was called');
          },
        )
      }).catch(_ => {
        transaction.rejectedMessage(msgSequence).then(_ => {
          console.log('msg was rejected');
        });
      });
    } else {
      console.log(`Received error of ${msg.Error}`);
    }
  } else if (msg.StreamRequestTypeData === 'AckMessage' || msg.StreamRequestTypeData === 'RejectMessage') {
    transaction.closeStream();
    console.log('msg Ack, stream was close');

    //loop a a long pool request.
    transaction = message_queue.createTransaction();
    transaction.receive(100, 1, queueHandler, errorHandler)
  }
};

function errorHandler(msg) {
  console.log(`Received error ${msg}`);
};

function workOnMSG(msg) {
  return new Promise((resolve, reject) => {
    if (msg.Message.Attributes.Sequence !== '3') {
      console.log('worked on msg');
      resolve();
    } else {
      reject();
    }
  });
};
```


### Transactional Queue – Extend Visibility
```JavaScript
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');
let transaction = message_queue.createTransaction();

function queueHandler(msg) {
  console.log(`Received messages ${msg.StreamRequestTypeData}`);
  if (msg.StreamRequestTypeData == 'ReceiveMessage') {
    console.log('Need more time to process, extend visibility for more 3 seconds');
    transaction.extendVisibility(3).then(_ => {
      console.log(`sent extendVisibilityRequest`);
    });
  }
}

function errorHandler(msg) {
  console.log(`Received error ${msg}`);
};
transaction.receive(5, 10, queueHandler, errorHandler);
```

### Transactional Queue – Resend to New Queue
```JavaScript
let message_queue = new kubemq.MessageQueue('localhost:50000', 'testQueue', 'client');

let transaction = message_queue.createTransaction();

function queueHandler(msg) {
  console.log(`Received messages ${msg}`);
  if (msg.StreamRequestTypeData == 'ReceiveMessage') {
    console.log('Received Message sending resend request.');
    transaction.resend('testQueue').then(_ => {
      console.log(`sent resend`);
    });
  }
}

function errorHandler(msg) {
  console.log(`Received error ${msg}`);
};

transaction.receive(5, 10, queueHandler, errorHandler);
```

### Transactional Queue – Resend Modified Message
```JavaScript
let channelName = "transaction-queue";
let kubemqAdd = "localhost:50000";
let message_queue = new kubemq.MessageQueue(kubemqAdd, channelName, "my-resend");
let transaction = message_queue.createTransaction();

function queueHandler(recm) {
  console.log(`Received messages ${recm}`);
  if (recm.StreamRequestTypeData == "ReceiveMessage") {
    console.log("Received Message sending resend request.");
    transaction.resend("new Queue").then(_ => {
      console.log(`sent resend`);
    });
  }
}

function errorHandler(msg) {
  console.log(`Received error ${msg}`);
}

transaction.receive(5, 10, queueHandler, errorHandler);
```

## Event
### Sending Events
#### Single event
```JavaScript
const pub = new kubemq.Publisher('localhost', '50000', 'pub', 'pubsub');

const event = new kubemq.Publisher.Event(kubemq.stringToByte('test'));

pub.send(event).then(res => {
  console.log(res);
});
```

#### Stream Events
```JavaScript
const kubemqAdd = 'localhost:50000';
const events = require('events');

let channelName = 'test-event-stream';
let send = new kubemq.Sender(kubemqAdd);
let bytes = kubemq.stringToByte('TestBody');
let eventEmitter = new events.EventEmitter();

send.streamEvent(eventEmitter);

for (let i = 1; i < 5; i++) {
  let event = new kubemq.LowLevelEvent(bytes);
  event.Channel = channelName;
  event.ClientID = 'MyID';
  eventEmitter.emit('message', event);
}
```

### Receiving Events
```JavaScript
let sub = new kubemq.Subscriber('localhost', '50000', 'sub', 'testing_event_channel');

sub.subscribeToEvents(msg => {
  console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}, err => {
  console.log('error:' + err)
});
```

## Event Store
### Subscription Options  
KubeMQ supports six types of subscriptions:
- StartFromNewEvents – start event store subscription with only new events  
- StartFromFirstEvent – replay all the stored events from the first available sequence and continue stream new events from this point  
- StartFromLastEvent – replay the last event and continue stream new events from this point  
- StartFromSequence – replay events from specific event sequence number and continue stream new events from this point  
- StartFromTime – replay events from specific time continue stream new events from this point  
- StartFromTimeDelta – replay events from specific current time – delta duration in seconds, continue stream new events from this point  

### Sending Event Store
#### Single Event Store
```JavaScript
let storePub = new kubemq.StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new kubemq.StorePublisher.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
  console.log(res);
});
```

### Receiving Events Store
```JavaScript
const storeSub = new kubemq.StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => {
    console.log('msg:' + msg.Metadata);
  }, err => {
    console.log('error:' + err);
  },
  kubemq.StoreSubscriber.EventStoreType.StartFromFirst, '1');
```

## Commands
### Concept
Commands implement the synchronous messaging pattern in which the sender sends a request and waits for a specific amount of time to get a response.  
The response can be successful or not. This is the responsibility of the responder to return with the result of the command within the time the sender set in the request.  

#### Receiving Commands Requests  
```JavaScript
const commandReceiver = new kubemq.CommandReceiver('localhost', '50000', 'cc', 'cmd');

commandReceiver.subscribe(cmd => {
  console.log(cmd);

  let respond = new kubemq.CommandReceiver.Response(cmd);
  respond.Executed = true;
  commandReceiver.sendResponse(respond).then(snd => {
    console.log('sent:' + snd);
  }).catch(err => {
    console.log(err);
  });

}, err => {
  console.log(err);
});
```

### Sending Command Request
```JavaScript
const sender = new kubemq.CommandSender('localhost', '50000', 'cc1', 'cmd', 10000);

let request = new kubemq.CommandSender.CommandRequest(kubemq.stringToByte('test'));

sender.send(request).then(res => {
  console.log(res.Executed);
});
```

## Queries
### Concept
Queries implement the synchronous messaging pattern in which the sender sends a request and waits for a specific amount of time to get a response.  

The response must include metadata or body together with an indication of successful or not operation. This is the responsibility of the responder to return with the result of the query within the time the sender set in the request.

### Receiving Query Requests
```JavaScript
const query = new kubemq.QueryReceiver('localhost', '50000', 'cc', 'qry', undefined, 10000);

query.subscribe(qry => {
    console.log(qry);
    let respond = new kubemq.QueryReceiver.QueryResponse(qry, kubemq.stringToByte('result:123'));
    query.sendResponse(respond).then(snd => {
      console.log('sent:' + snd);
    }).catch(cht => console.log(cht));

  }, err => {
    console.log(err);
  }
);
```

### Sending Query Requests
```JavaScript
const qrySend = new kubemq.QuerySender('localhost', '50000', 'cc1', 'qry', 10000);

let request = new kubemq.QueryRequest(kubemq.stringToByte('select books'));
qrySend.send(request).then(res => {
  console.log(res)
});
```
