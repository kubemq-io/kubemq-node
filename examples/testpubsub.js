

const byteConverter = require('../tools/stringToByte');

/**
 * event pubsub
 */

const Subscriber = require('../pubSub/events/subscriber');
let sub = new Subscriber('localhost', '50000', 'sub', 'testing_event_channel');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => {
        console.log('error:' + err)
    });


const Publisher = require('../pubSub/events/publisher');
const pub = new Publisher('localhost', '50000', 'pub', 'pubsub');

let event = new Publisher.Event(byteConverter.stringToByte('test'));

pub.send(event).then(res => {
    console.log(res);
});


/**
 * persistance store pubsub.
 */
const StoreSubscriber = require('../pubSub/eventsStore/storeSubscriber');
const storeSub = new StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => {
    console.log('msg:' + msg.Metadata)
}
    , err => { console.log('error:' + err) },
    StoreSubscriber.EventStoreType.StartFromFirst, '1');

const StorePublisher = require('../pubSub/eventsStore/storePublisher');
const storePub = new StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new StorePublisher.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});


