const kubemq = require('../../kubemq');
let kubemqAdd = "localhost:50000";

const events = require('events');

let channelName = "test-event-stream";
let send = new kubemq.Sender(kubemqAdd);
let bytes = [];

for (let i = 0; i < "myTestStream".length; i++) {
    let char = "myTestStream".charCodeAt(i);
    bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
}

let eventEmitter = new events.EventEmitter();


send.streamEvent(eventEmitter)
console.log('test')
for (let i = 1; i < 5; i++) {
    let event = new kubemq.LowLevelEvent(bytes);
    event.Channel = channelName;
    event.ClientID = "MyID";
    eventEmitter.emit('message', event)

}