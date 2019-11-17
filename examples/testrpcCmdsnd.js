var byteConv = require('../tools/stringToByte');

const commandSender = require('../rpc/command/commandSender');

var sender = new commandSender.CommandSender('localhost', '50000', 'cc1', 'cmd', 10000);

var request = new commandSender.CommandRequest(byteConv.stringToByte(''));

sender.send(request).then(
  
    res => { console.log(res.Executed) });