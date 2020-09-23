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
  /** Class representing a query receiver pattern subscriber. */
class QueryReceiver{
    /**
     * 
   * @param {string} kubeMQHost - The KubeMQ address.
   * @param {number} kubeMQGrpcPort - The KubeMQ Grpc exposed port.
   * @param {string} client - The publisher ID, for tracking.
   * @param {string} channel - The pub sub communication channel.
   * @param {string} group - Non mandatory group for round robin subscription.
   * @param {number} defaultTimeout - The default response timeout. 
   * @param {string} encryption_header -   Non mandatory for encryption header for kubemq authorization mode
   */
    constructor(kubeMQHost, kubeMQGrpcPort, client, channel, group, defaultTimeout,encryption_header = "")
    {
        this.rpc = new rpc(kubeMQHost, kubeMQGrpcPort, client, channel, rpc.Type.Query,group, defaultTimeout,encryption_header)
    }
    
    /**
     * Callback for incoming Query.
     *
     * @callback req_handler
     * @param {string} msg - receive data.
     */

    /**
    * Callback for incoming errors.
    *
    * @callback error_handler
    * @param {string} err - receive error.
    */

     /**
     * Subscribe to streaming query requests.
     * @param {req_handler} req_handler  - Callback for incoming query.
     * @param {error_handler} error_handler - Callback for incoming errors.
     */
    subscribe(req_handler, error_handler) {
        this.rpc.subscribe(req_handler, error_handler);
    }

    /**
     * Unsubscribe from streaming query requests.
     */
    unsubscribe()
    {
        this.rpc.unsubscribe();
    }

    /**
     * 
     * @param {QueryResponse} response - The query execution data return.
     */
    sendResponse(response) {
      return this.rpc.sendResponse(response);
    }
}

module.exports = QueryReceiver;
module.exports.QueryResponse = rpc.QueryResponse.QueryResponse;