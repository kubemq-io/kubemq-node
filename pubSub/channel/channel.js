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

//Represents the instance that is responsible to send events to the kubemq.

const Sender = require('../lowLevel/sender')
const Event = require('../PubSub/lowlevel/event')
const ChannelParameters = require('./channelParameters')
class Channel {
    constructor(params) {
        this.channel_name = params.channel_name;
        this.client_id = params.client_id;
        this.store = params.store;
        this.sendEvent = this.sendEvent.bind(this)
        this.createLowLevelEvent = this.createLowLevelEvent.bind(this)
        this.sender = new Sender(params.kubemq_address)
        this.stream = null

    }
    //Publish a single event to kubemq.
    sendEvent(event) {
        return new Promise((resolve, reject) => {
            event.Channel = this.channel_name;
            event.ClientID = this.client_id;
            event.Store = this.store;
            this.sender.sendEvent(event).then(Response => {
                resolve(Response)
            })
        })
    }

    streamEvent(event_emitter) {
        event_emitter.on('message', (data) => {
            data.Channel = this.channel_name;
            data.ClientID = this.client_id;
            data.Store = this.store;
            this.stream.write(data);
        })

        this.stream = Sender.grpc_conn.get_kubemq_client().SendEventsStream();
    }
}


module.exports = Channel, ChannelParameters;
