const QueryReceiver = require('../rpc/query/queryReceiver');
const stringToByte = require('../tools/stringToByte').stringToByte;
const query = new QueryReceiver('localhost', '50000', 'cc', 'qry', undefined, 10000);

query.subscribe(qry => {
    console.log(qry);
    let respond = new QueryReceiver.QueryResponse(qry, stringToByte('result:123'));
    query.sendResponse(respond).then(snd => {
        console.log('sent:' +snd);
    }).catch(cht => console.log(cht));

}, err => {
    console.log(err);
}
)

