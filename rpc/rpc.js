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

const Sender = require('./lowLevel/initiator')
const Responder = require('./lowLevel/responder')
const Request = require('./lowLevel/queryRequest')
const QueryResponse = require('./lowLevel/queryResponse');

class rpc {

    constructor(kubeMQHost, kubeMQGRPCport, client, channel, type, group, defaultTimeout ) {

        this.kubeMQHost = kubeMQHost;
        this.kubeMQport = isNaN(kubeMQGRPCport)? kubeMQGRPCport.toString() : kubeMQGRPCport ;
        this.channel = channel;
        this.defaultTimeout = defaultTimeout;
        this.client = client;
        this.type = type;
        this.group = group;
        this.sender = new Sender(kubeMQHost.concat(':', this.kubeMQport))
    }

    send(request) {
        request.Channel = this.channel;
        request.ClientID = this.client;

        request.RequestTypeData = this.type;

        if (request.Timeout === undefined) {
            request.Timeout = this.defaultTimeout;
        }

        return  this.sender.sendRequest(request);       
    }

    subscribe(req_handler, error_handler) {
        this.responder = new Responder(this.kubeMQHost.concat(':', this.kubeMQport));
        let subRequest = {
            SubscribeTypeData: this.type + 2,
            ClientID: this.client,
            Channel: this.channel,
            Group: this.group


        }
        this.responder.subscribeToRequests(subRequest, req_handler, error_handler);
    }

    unsubscribe()
    {
        if (this.responder!== undefined){
            this.responder.Stop();
        }
    }
    sendResponse(response) {
        response.ClientID = this.client;
       return this.responder.sendResponse(response);
    }

}

module.exports = rpc;

module.exports.Type = {
    Command: 1,
    Query: 2
};


module.exports.Request = Request;
module.exports.QueryResponse = QueryResponse;


