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

class ChannelParameters{
    constructor(channel_name=null,client_id,store=null,kubemq_address=null){
        //Represents The channel name to send to using the KubeMQ.
        this.channel_name      =    channel_name;
        //Represents the sender ID that the messages will be send under.
        this.client_id         =    client_id;
        //Represents the channel persistence property.
        this.store             =    store;
        //Represents The address of the KubeMQ server.
        this.kubemq_address    =    kubemq_address;
    }
}
module.exports = ChannelParameters;