const RPC = require('../rpc');

/** Class representing a CommandSender.*/
/* MIT License

Copyright (c) 2019 KubeMQ

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

const rpc = require('../rpc');
const CommandRequest = require('../lowLevel/commandRequest')
/**
 * Class representing a Command Sender.
 */
class CommandSender{
    
    /** Create a CommandSender.
    * @param {string} kubeMQHost - The KubeMQ address.
    * @param {number} kubeMQGrpcPort - The KubeMQ Grpc exposed port.
    * @param {string} client - The receiver ID, for tracing.
    * @param {string} channelName - The pub sub communication channel. 
    * @param {number} defaultTimeout - The default response timeout. 
    */

    constructor(kubeMQHost, kubeMQGrpcPort, client, channel, defaultTimeout)
    {
        this.rpc = new rpc(kubeMQHost, kubeMQGrpcPort, client, channel, rpc.Type.Command,undefined, defaultTimeout)
    }

    /**
     * 
     * @param {CommandRequest} request - The command request.
     */
    send(request) {     
        return  this.rpc.send(request);
    }

}

module.exports = CommandSender;
module.exports.CommandRequest = CommandRequest;
