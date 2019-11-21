

var byteConverter = require('../tools/stringToByte');

/**
 * event pubsub
 */

var Subscriber = require('../pubSub/events/subscriber');
let sub = new Subscriber('localhost', '50000', 'sub', 'pubsub');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => { console.log('error:' + err) })



var Publisher = require('../pubSub/events/publisher');
let pub = new Publisher('localhost', '50000', 'pub', 'pubsub');

let event = new Publisher.Event(byteConverter.stringToByte('test'));



pub.send(event).then(res => {
    console.log(res);
});


/**
 * persistance store pubsub.
 */
var storeSubscriber = require('../pubSub/eventsStore/storeSubscriber');
let storeSub = new storeSubscriber.StoreSubscriber('localhost', '50000', 'sub', 'pubsubper');

storeSub.subscribeToEvents(msg => { 
    console.log('msg:' + msg.Metadata) }
    , err => { console.log('error:' + err) },
    storeSubscriber.EventStoreType.StartFromFirst);

var storePublish = require('../pubSub/eventsStore/storePublisher');
let storePub = new storePublish.StorePublisher('localhost', '50000', 'pub', 'pubsubper');

let eventStore = new storePublish.Event('test');
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});


