
var qrySendClass = require('../../rpc/query/querySender');
var qrySend = new qrySendClass.QuerySender('localhost', '50000', 'cc-hello-world-1', 'qry-hello-world', 10000);

var request = new qrySendClass.QueryRequest('ff');



qrySend.send(request).then(res => {
     console.log(res) });