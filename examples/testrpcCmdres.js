const stringConvert = require('../tools/stringToByte');

const CommandReceiver = require('../rpc/command/commandReceiver');

const commandReceiver = new CommandReceiver('localhost', '50000', 'cc', 'cmd');

commandReceiver.subscribe(cmd => {
    console.log(cmd);

    let respond = new CommandReceiver.Response(cmd);
    respond.Executed = true;
    commandReceiver.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(err => {
        console.log(err)
    });

}, err => {
    console.log(err);
});