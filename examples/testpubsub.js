

var byteConverter = require('../tools/stringToByte');

/**
 * event pubsub
 */

var subscriber = require('../pubSub/events/subscriber');
let sub = new subscriber.Subscriber('localhost', '50000', 'sub', 'pubsub');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => { console.log('error:' + err) })



var publish = require('../pubSub/events/publisher');
let pub = new publish.Publisher('localhost', '50000', 'pub', 'pubsub');

let event = new publish.Event(byteConverter.stringToByte('test'));



pub.send(event).then(res => {
    console.log(res);
});


/**
 * persistance store pubsub.
 */
var storeSubscriber = require('../pubSub/eventsStore/StoreSubscriber');
let storeSub = new storeSubscriber.StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => { 
    console.log('msg:' + msg.Metadata) }
    , err => { console.log('error:' + err) },
    storeSubscriber.EventStoreType.StartFromFirst);

var storePublish = require('../pubSub/eventsStore/StorePublisher');
let storePub = new storePublish.StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new storePublish.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});


