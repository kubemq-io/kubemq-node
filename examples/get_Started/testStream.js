
let kubemqAdd = "localhost:50000";

const sender          =   require('../../pubSub/lowLevel/sender');
const events          =   require('events');
const lowLevelEvent   =   require('../../pubSub/lowLevel/event')
var byteConv          =   require('../../tools/stringToByte');
let channelName	        =	  "hello-world-stream";
let send                =	  new sender(kubemqAdd);
let bytes = byteConv.stringToByte("hello world stream" ); 

let eventEmmiter = new events.EventEmitter();


send.streamEvent(eventEmmiter)
console.log('test')
for (let i = 1; i < 5; i++) {
  let event= new lowLevelEvent(bytes);
  event.Channel = channelName;
  event.ClientID ="MyID";
  eventEmmiter.emit('message',event)
  
}