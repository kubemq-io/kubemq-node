const stringConvert = require('../../tools/stringToByte');

var commandReceiver = require('../../rpc/command/commandReceiver');


var cmdRes = new commandReceiver.CommandReceiver('localhost', '50000', 'cc-hello-world', 'cmd-hello-world');
cmdRes.subscribe(cmd => {
    console.log(cmd);

    let respond = new commandReceiver.Response(cmd);
    respond.Executed = true;
    cmdRes.sendResponse(respond).then(snd => {
        'sent:' + snd;
    }).catch(err => console.log(err));

}, err => {
    console.log(err);
}
)