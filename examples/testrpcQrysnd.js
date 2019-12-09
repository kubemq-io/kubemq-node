
const stringToByte = require('../tools/stringToByte').stringToByte;
const QuerySender = require('../rpc/query/querySender');
const qrySend = new QuerySender('localhost', '50000', 'cc1', 'qry', 10000);

let request = new QuerySender.QueryRequest(stringToByte('select books'));
qrySend.send(request).then(res => {
     console.log(res) });