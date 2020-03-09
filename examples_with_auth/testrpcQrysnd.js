const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
const qrySend = new kubemq.QuerySender('localhost', '50000', 'cc1', 'qry', 10000,jwt_token);

let request = new kubemq.QueryRequest(kubemq.stringToByte('select books'));
qrySend.send(request).then(res => {
     console.log(res) });