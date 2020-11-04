const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
const query = new kubemq.QueryReceiver('localhost', 50000, 'cc', 'qry', undefined, 10000, jwt_token);

query.subscribe(qry => {
        console.log(qry);
        console.log('Body:' + kubemq.byteToString(qry.Body));
        let respond = new kubemq.QueryReceiver.QueryResponse(qry, kubemq.stringToByte('result:123'));
        query.sendResponse(respond).then(snd => {
            console.log('sent:' + snd);
        }).catch(cht => console.log(cht));

    }, err => {
        console.log(err);
    }
)

