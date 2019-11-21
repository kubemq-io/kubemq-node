var Queue = require('./queue');

var byteConverter = require('../tools/stringToByte');

var queue = new Queue('localhost', 9090, 'client', 'queue1', '1b12c563-4f8a-49e9-94e1-aa29b7be70d6', 'round1');

queue.ping().then(res => {
    console.log('ping:' + res);
});

let message = require('../queue/message');
let msg = new message();
msg.Body = byteConverter.stringToByte('msgbody');
msg.Metadata = 'this is msg1';
q.send(msg).then(res => {
    console.log('send:' + res);
});



queue.receive(1).then(res => {
    console.log('Receive:' + res);
});

q.peek(10).then(res => {
    console.log('Peek:' + res);
});

q.ackAllMessages().then(res => {
    console.log('AckAllMessages:' + res);
});

var msgs = [];
for (let index = 0; index < 2; index++) {
    msgs.push(new message('message:' + index, byteConverter.stringToByte('messages')));

}

q.sendBatch(msgs).then(res => {
    console.log('SendBatch:' + res);
});



