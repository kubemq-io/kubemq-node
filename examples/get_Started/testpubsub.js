

var byteConverter   = require('../../tools/stringToByte');
var Subscriber      = require('../../pubSub/events/subscriber');
var Publisher       = require('../../pubSub/events/publisher');
var storeSubscriber = require('../../pubSub/eventsStore/StoreSubscriber');
var storePublish    = require('../../pubSub/eventsStore/StorePublisher');
/**
 * event pubsub
 */
let sub = new Subscriber('localhost', '50000', 'hello-world-sub', 'pubsub');

sub.subscribeToEvents(msg => {
    console.log('msg:' + String.fromCharCode.apply(null, msg.Body))
}
    , err => { console.log('error:' + err) })




let pub = new Publisher('localhost', '50000', 'hello-world-pub', 'pubsub');

let event = new Publisher.Event(byteConverter.stringToByte('hello-world'));



pub.send(event).then(res => {
    console.log(res);
});


/**
 * persistance store pubsub.
 */

let storeSub = new storeSubscriber.StoreSubscriber('localhost', '50000', 'hello-world-sub', 'pubsuber');

storeSub.subscribeToEvents(msg => { 
    console.log('msg:' + msg.Metadata) }
    , err => { console.log('error:' + err) },
    storeSubscriber.EventStoreType.StartFromFirst);


let storePub = new storePublish.StorePublisher('localhost', '50000', 'hello-world-pub', 'pubsuber');

let eventStore = new storePublish.Event(byteConverter.stringToByte('hello-kubemq'));
eventStore.Metadata = 'test store';

storePub.send(eventStore).then(res => {
    console.log(res);
});


