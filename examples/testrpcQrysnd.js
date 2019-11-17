
var qrySendClass = require('../rpc/query/querySender');
var qrySend = new qrySendClass.QuerySender('localhost', '50000', 'cc1', 'qry', 10000);

var request = new qrySendClass.QueryRequest('ff');



qrySend.send(request).then(res => {
     console.log(res) });