const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
const sender = new kubemq.CommandSender('localhost', '50000', 'cc1', 'cmd', 10000,jwt_token);

let request = new kubemq.CommandSender.CommandRequest(kubemq.stringToByte('test'));

sender.send(request).then(res => {
        console.log(res.Executed)
    }).catch(err => {
        console.log('message  Command Request  error, error:' + err);
});