const kubemq = require('../../kubemq');

let channelName = 'sub', clientID = 'hello-testing_event_channel-subscriber',
    kubeMQHost = 'localhost', kubeMQGrpcPort = 50000;

let sub = new kubemq.Subscriber(kubeMQHost, kubeMQGrpcPort, clientID, channelName);

sub.subscribeToEvents(msg => {
    console.log(`Event Received: EventID:${msg.EventID}, Channel:${msg.Channel} ,Metadata:${msg.Metadata}, Body:${kubemq.byteToString(msg.Body)}`);
}, err => {
    console.log(`error:${err}`)
})

const publisher = new kubemq.Publisher(kubeMQHost, kubeMQGrpcPort, clientID, channelName);

let event = new kubemq.Publisher.Event(kubemq.stringToByte('hello kubemq - sending single event'));
let tag = {};
tag['key3.abc'] = "value3";
event.Metadata = "my_meta_data";
event.Tags = tag;


publisher.send(event).then(
    res => {
        console.log(res);
    }).catch(
    err => {
        console.log(`error sending:${err}`)
    });
