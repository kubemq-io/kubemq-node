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

const PubSub = require('../pubSub')
  /** Class representing an event with persistent storage pattern subscriber. */
class StoreSubscriber{
    /**
   * Create a persistent event store Subscriber.
   * @param {string} kubeMQHost - The KubeMQ address.
   * @param {number} kubeMQGrpcPort - The KubeMQ Grpc exposed port.
   * @param {string} client - The publisher ID, for tracing.
   * @param {string} channelName - The pub sub communication channel.
   * @param {string} group - Non mandatory group for round robin subscription.
   * @param {string} encryptionHeader - Non mandatory for encryption header for kubemq authorization mode 
   */
    constructor(kubeMQHost, kubeMQGrpcPort, client, channelName, group,encryptionHeader = "") {
        this.pubSub = new PubSub(kubeMQHost, kubeMQGrpcPort, client, channelName, group, true,encryptionHeader)
    }

     /**
     * Callback for incoming events.
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
     * Subscribe to streaming events
     * @param {req_handler} callback - Callback for incoming events.
     * @param {error_handler} callback - Callback for incoming errors.
     * @param {EventStoreType} eventsStoreTypeData - Type for start listening from: StartNewOnly, StartFromFirst  StartAtSequence  StartAtTime, StartAtTimeDelta.
     * @param {string} eventsStoreTypeValue - Value of eventsStoreTypeData.
     */

    subscribeToEvents(req_handler,error_handler, eventsStoreTypeData, eventsStoreTypeValue) {       
      
        let eventStoreProp = PubSub.StoreProperties;        
        eventStoreProp.EventsStoreTypeData = eventsStoreTypeData;
        eventStoreProp.EventsStoreTypeValue = eventsStoreTypeValue;
    
        return this.pubSub.subscribeToEvents(req_handler,error_handler,eventStoreProp)

    }

    /**
     * Unsubscribe to streaming events
     */
    unsubscribe()
    {
       this.pubSub.unsubscribe();
    }

}

module.exports = StoreSubscriber;

module.exports.EventStoreType = PubSub.EventStoreType;