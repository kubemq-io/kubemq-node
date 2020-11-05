const kubemq = require('../kubemq');
const query = new kubemq.QueryReceiver('localhost', 50000, 'cc', 'qry', undefined, 10000);

query.subscribe(qry => {
        console.log(qry);
        console.log('Body:' + kubemq.byteToString(qry.Body));
        let respond = new kubemq.QueryReceiver.QueryResponse(qry, kubemq.stringToByte('result:123'));
        query.sendResponse(respond).then(snd => {
            console.log('sent: message ');
        }).catch(cht => console.log(cht));

    }, err => {
        console.log(err);
    }
)

