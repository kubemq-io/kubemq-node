var qryResClass = require('../../rpc/query/queryReceiver');

var byteConv = require('../../tools/stringToByte');

var query = new qryResClass.QueryReceiver('localhost', '50000', 'cc-hello-world', 'qry-hello-world', undefined, 10000);
query.subscribe(qry => {
    console.log(qry);
    

    var respond = new qryResClass.QueryResponse(qry, byteConv.stringToByte('result:123')
    )
    query.sendResponse(respond).then(snd => {
        console.log('sent:' +snd);
    }).catch(cht => console.log(cht));

}, err => {
    console.log(err);
}
)

