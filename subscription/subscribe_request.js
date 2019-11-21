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
const sub_type= require('../pubSub/pubSub');
//SubscriberRequest -Struct that need to fill for subscribe to event.
class SubscriberRequest{
    /**
     * Struct that need to fill for subscribe to events.
     * @param {SubscribeType} subscribe_type    -    Enum represent the type of subscription. 
     * @param {string} client_id                -    The publisher ID, for tracing. 
     * @param {string} channel                  -    The channel to subscribe under.
     * @param {EventStoreType} events_store_type-    The type of subscription to listen to .
     * @param {number} events_store_type_value  -    The value of subscription to register under. 
     * @param {string} group                    -    The name of the group to register under.
     */
    constructor(subscribe_type=null,client_id=null,channel=null,events_store_type=null,events_store_type_value=null,group=""){
        this.subscribe_type=subscribe_type;

        this.client_id                  =       client_id;

        this.channel                    =       channel;

        this.events_store_type          =       events_store_type;

        this.events_store_type_value    =       events_store_type_value;

        this.group                      =       group;
    }

    toInnerSubscribeRequest(){
        let subscribeRequest     =   {
            SubscribeTypeData       :    this.subscribe_type.value,
            ClientID                :    this.client_id,
            Channel                 :    this.channel,
            Group                   :    this.group,
            EventsStoreTypeData     :    this.events_store_type,
            EventsStoreTypeValue    :    this.events_store_type_value
             
        };

        return subscribeRequest;
    }
    //Verify subscriber type matching.
    isValidType(subscriber){

        if (subscriber=="CommandQuery") {

            return this.subscribe_type      ==      sub_type.SubscribeType.Commands || this.subscribe_type==sub_type.SubscribeType.Queries;

        }else{

            return this.subscribe_type      ==      sub_type.SubscribeType.Events || this.subscribe_type==sub_type.SubscribeType.EventsStore;

        }
    }
}

function fromInnerSubscribeRequest(inner){
    let    subscribeRequest   =   {
        client_id                   :   inner.ClientID,
        channel                     :   inner.Channel,
        group                       :   inner.Group   ||  "",
        events_store_type_value     :   inner.EventsStoreTypeValue,
    };
    return subscribeRequest;
}

module.exports =  SubscriberRequest;
module.exports.fromInnerSubscribeRequest =  fromInnerSubscribeRequest;