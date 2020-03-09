const kubemq = require('../kubemq');
let jwt_token = "eyJhbGciOiJIUzI1NiJ9.e30.tNiB_q4Qk-ox-ZrEADaLi9gJpKZ9KJUSP16uqjHAdTE";
const commandReceiver = new kubemq.CommandReceiver('localhost', '50000', 'cc', 'cmd',undefined,jwt_token);

commandReceiver.subscribe(cmd => {
    console.log(cmd);

    let respond = new kubemq.CommandReceiver.Response(cmd);
    respond.Executed = true;
    commandReceiver.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(err => {
        console.log(err)
    });

}, err => {
    console.log(err);
});