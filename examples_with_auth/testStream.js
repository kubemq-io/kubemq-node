
const kubemq = require('../kubemq');
let kubemqAdd = "localhost:50000";
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
const events          =   require('events');

let channelName	        =	  "test-event-stream";
let send                =	  new kubemq.Sender(kubemqAdd,jwt_token);
let bytes = [];

for (let i = 0; i < "myTestStream".length; i++) {
  let char = "myTestStream".charCodeAt(i);
  bytes.push(char >>> 8);
  bytes.push(char & 0xFF);
}

let eventEmmiter = new events.EventEmitter();


send.streamEvent(eventEmmiter)
for (let i = 1; i < 5; i++) {
  let event= new kubemq.LowLevelEvent(bytes);
  event.Channel = channelName;
  event.ClientID ="MyID";
  eventEmmiter.emit('message',event)
  
}