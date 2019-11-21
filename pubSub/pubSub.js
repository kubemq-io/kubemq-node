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


const Sender=require('./lowLevel/sender')
const Subscriber = require('./lowLevel/subscriber')
const Event = require('./lowLevel/event')

var subscriber;
var sender;

class PubSub{
    constructor(kubeMQHost, kubeMQPort, client, channelName, group, useStore=false) {
   
        this.kubeMQHost    =  kubeMQHost;
        this.kubeMQPort    =  isNaN(kubeMQPort)? kubeMQPort.toString() : kubeMQPort ;
        this.channel     =  channelName;
        this.client_id        =  client;
        this.store         = useStore;
        this.group          =group;
        sender                 =    new Sender(this.kubeMQHost.concat(':',  this.kubeMQPort))
    }


    send(event){
        event.Channel = this.channel;
        event.ClientID = this.client_id;
        event.Store = this.store;

         return sender.sendEvent(event);

    }

    stream(event_emitter){
        event_emitter.on('message', (data)=> {
            data.Channel = this.channel;
            data.ClientID = this.client_id;
            data.Store = this.store;
                this.stream.write(data);
            })

            this.stream     =   Sender.grpc_conn.get_kubemq_client().SendEventsStream();
    }


    subscribeToEvents(req_handler,error_handler, storeProperties){       
        subscriber  = new Subscriber.Subscriber(this.kubeMQHost.concat(':',this.kubeMQPort));
    
        var subRequest = {
            SubscribeTypeData :   this.store  ? Subscriber.SubscribeType.EventsStore : Subscriber.SubscribeType.Events, ClientID: this.client_id ,Channel: this.channel
        }

        if (this.store){
            subRequest.EventsStoreTypeData = storeProperties.EventsStoreTypeData;
            subRequest.EventsStoreTypeValue = storeProperties.EventsStoreTypeValue;
        }

        if(this.group !== undefined){
            subRequest.group = this.group;
        }
       

        subscriber.subscribeToEvents(subRequest,req_handler, error_handler)
    }
    unsubscribe()
    {
        if (subscriber!== undefined){
            subscriber.Stop();
        }
    }

}
class StoreProperties{
    constructor(EventsStoreTypeData=Subscriber.EventStoreType.Undefined,EventsStoreTypeValue={}){
        this.EventsStoreTypeData       =    EventsStoreTypeData;
        this.EventsStoreTypeValue      =    EventsStoreTypeValue;
    }
}

module.exports = PubSub

module.exports = {Event,StoreProperties};

module.exports.EventStoreType = Subscriber.EventStoreType;