const kubemq = require('../../kubemq');
const qrySend = new kubemq.QuerySender('localhost', 50000, 'cc1', 'qry', 10000);

let request = new kubemq.QueryRequest(kubemq.stringToByte('select books'));
qrySend.send(request).then(res => {
    console.log(res)
}).catch(err => {
    console.log('message  query send  error, error:' + err);
});