var byteConv = require('../../tools/stringToByte');

const commandSender = require('../../rpc/command/commandSender');

var sender = new commandSender.CommandSender('localhost', '50000', 'cc-hello-world-1', 'cmd-hello-world', 10000);

var request = new commandSender.CommandRequest(byteConv.stringToByte('hello-world'));

sender.send(request).then(
  
    res => { console.log(res.Executed) });