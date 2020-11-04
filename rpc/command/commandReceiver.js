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

const rpc = require('../rpc');
const CommandResponse = require('../lowlevel/commandResponse');

/** Class representing a CommandReceiver.*/
class CommandReceiver{
    /** Create a CommandReceiver.
    * @param {string} kubeMQHost - The KubeMQ address.
    * @param {number} kubeMQGrpcPort - The KubeMQ Grpc exposed port.
    * @param {string} client - The receiver ID, for tracing.
    * @param {string} channel - The pub sub communication channel.
    * @param {string} group - Non mandatory group for round robin subscription.
    * @param {string} encryptionHeader -   encryption header for kubemq authorization mode
    */
    constructor(kubeMQHost, kubeMQGrpcPort, client, channel, group,encryptionHeader = "")
    {
        this.rpc = new rpc(kubeMQHost, kubeMQGrpcPort, client, channel, rpc.Type.Command,group, 1000 , encryptionHeader)
    }

     /**
     * Callback for incoming events.
     *
     * @callback req_handler
     * @param {string} msg - received data.
     */

    /**
    * Callback for incoming errors.
    *
    * @callback error_handler
    * @param {string} err - received error.
    */
   
    /**
     * Subscribe to streaming Command requests
     * @param {req_handler} req_handler  - Callback for incoming events.
     * @param {error_handler} error_handler - Callback for incoming errors.
     */
    subscribe(req_handler, error_handler) {     
        this.rpc.subscribe(req_handler, error_handler);
    }

    /**
     * UnSubscribe from streaming Command requests
     */
    unsubscribe()
    {
        this.rpc.unsubscribe();
    }

    /**
     * @param {Response} response - The command executed response.
     */
    sendResponse(response) {
      return  this.rpc.sendResponse(response);
    }
}

module.exports = CommandReceiver;
module.exports.Response = CommandResponse;
module.exports.CommandRequest = rpc.Request;