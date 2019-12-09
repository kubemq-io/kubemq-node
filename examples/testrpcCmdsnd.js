const stringToByte = require('../tools/stringToByte').stringToByte;
const CommandSender = require('../rpc/command/commandSender');
const sender = new CommandSender('localhost', '50000', 'cc1', 'cmd', 10000);

let request = new CommandSender.CommandRequest(stringToByte('test'));

sender.send(request).then(res => {
        console.log(res.Executed)
    });