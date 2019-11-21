/* MIT License

Copyright (c) 2018 KubeMQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var stringToByte = require('../tools/stringToByte').stringToByte;
const CommandSender = require('../rpc/command/commandSender');

let kubeMQHost = 'localhost', kubeMQGrpcPort = '50000',
    channelName = 'testing_Command_channel', clientID = 'hello-world-sender',
    defaultTimeOut = 10000;

var sender = new CommandSender(kubeMQHost, kubeMQGrpcPort, clientID, channelName, defaultTimeOut);

var request = new CommandSender.CommandRequest(
    stringToByte(' hello kubemq - sending a command, please reply'));

sender.send(request).then(
    res => {
        if (res.Error) {
            console.log('Response error: ' + res.message);
            return;
        }
        console.log('Response Received:' + res.RequestID + ' ExecutedAt:' + res.Timestamp);
    }).catch(
        err => {
            console.log('command error: ' + err)
        });