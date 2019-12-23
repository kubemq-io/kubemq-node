

const byteConverter = require('../tools/stringToByte');

/**
 * event pubsub
 */

const kubemq = require('../kubemq');
let sub = new kubemq.Subscriber('localhost', '50000', 'sub', 'testing_event_channel');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => {
        console.log('error:' + err)
    });


const pub = new kubemq.Publisher('localhost', '50000', 'pub', 'pubsub');

let event = new kubemq.Publisher.Event(byteConverter.stringToByte('test'));

pub.send(event).then(res => {
    console.log(res);
});


/**
 * persistance store pubsub.
 */

const storeSub = new kubemq.StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => {
    console.log('msg:' + msg.Metadata)
}
    , err => { console.log('error:' + err) },
    kubemq.StoreSubscriber.EventStoreType.StartFromFirst, '1');

const storePub = new kubemq.StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new kubemq.StorePublisher.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});


