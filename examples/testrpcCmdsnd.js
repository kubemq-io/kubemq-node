const kubemq = require('../kubemq');
const sender = new kubemq.CommandSender('localhost', 50000, 'cc1', 'cmd', 10000);

let request = new kubemq.CommandSender.CommandRequest(kubemq.stringToByte('test'));

sender.send(request).then(res => {
    console.log(res.Executed)
});