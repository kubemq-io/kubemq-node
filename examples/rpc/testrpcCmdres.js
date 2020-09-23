const kubemq = require('../../kubemq');

const commandReceiver = new kubemq.CommandReceiver('localhost', 50000, 'cc', 'cmd');

commandReceiver.subscribe(cmd => {
    console.log(cmd);

    let respond = new kubemq.CommandReceiver.Response(cmd, true);
    commandReceiver.sendResponse(respond).then(snd => {
        `sent:${snd}`;
    }).catch(err => {
        console.log(err)
    });

}, err => {
    console.log(err);
});