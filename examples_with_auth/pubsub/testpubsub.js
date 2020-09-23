const kubemq = require('../../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
let channelName = 'sub', clientID = 'hello-testing_event_channel-subscriber',
    kubeMQHost = 'localhost', kubeMQGrpcPort = 50000;

let sub = new kubemq.Subscriber(kubeMQHost, kubeMQGrpcPort, clientID, channelName, undefined, jwt_token);

sub.subscribeToEvents(msg => {
    console.log('Event Received: EventID:' + msg.EventID + ', Channel:' + msg.Channel + ' ,Metadata:' + msg.Metadata + ', Body:' + kubemq.byteToString(msg.Body));
}, err => {
    console.log('error:' + err)
})

const publisher = new kubemq.Publisher(kubeMQHost, kubeMQGrpcPort, clientID, channelName, jwt_token);

let event = new kubemq.Publisher.Event(kubemq.stringToByte('hello kubemq - sending single event'));

publisher.send(event).then(
    res => {
        console.log(res);
    }).catch(
    err => {
        console.log('error sending' + err)
    });

//Store
let storeSub = new kubemq.StoreSubscriber('localhost', 50000, clientID + 'store', channelName, undefined, jwt_token);

storeSub.subscribeToEvents(msg => {
        console.log('msg:' + msg.Metadata)
    },
    err => {
        console.log('error:' + err)
    },

    kubemq.EventStoreType.StartFromFirst, '1');

let storePub = new kubemq.StorePublisher('localhost', 50000, clientID + 'sender', channelName, jwt_token);

let eventStore = new kubemq.StorePublisher.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(
    res => {
        console.log(res);
    }).catch(
    err => {
        console.log('error sending' + err)
    });
