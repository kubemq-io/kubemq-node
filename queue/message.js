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

var id_gen = require("../tools/id_generator");

/**
* Message to send to kubemq.queue
* @param {string} Metadata          -     General information about the message body.
* @param {string} Body              -     The information that you want to pass.
* @param {string} Tags              -     Key value pair that represent the message to help identify it.
* @param {string} MessageID         -     Unique identifier  to the message , if null will create a running one.
*/
class Message{
    constructor(Metadata=null,Body=null,Tags=null,MessageID=null){

        //Represents The channel name to send to using the KubeMQ .
        this.MessageID      =    MessageID || id_gen.get_next_id();
        //Represents the sender ID that the events will be send under.
        this.ClientID       =    null;
        //Represents if the events should be send to persistence.
        this.Channel        =    null;
        //Represents a event identifier.
        this.Metadata       =    Metadata;
        //Represents text as str.
        this.Body           =    Body;
        //Represents the content of the event.
        this.Tags           =    Tags;
        //key value pair to help distinguish the event.
        this.Attributes     =    null;
        //key value pair to help distinguish the event.
        this.Policy         =    {};
    } 

    addExpiration(expiration){
        this.Policy.expirationSeconds = expiration;          
    }

    addDelay(delay){  
       this.Policy.delaySeconds = delay;        
    }

    addMaxReceiveCount(maxReceive, maxReceiveQueueName){
        this.Policy.maxReceiveCount = maxReceive;
        this.Policy.maxReceiveQueue = maxReceiveQueueName;
    }
}


function convertToQueueMessage(message,queue) {
    let inner_message = {
        metadata       :     message.Metadata,
        body           :     message.Body,
        tags           :     message.Tags || "",
        message_id     :     message.MessageID || id_gen.get_next_id() ,
        client_id      :     message.ClientID || queue.client_id, 
        queue          :     message.Channel || queue.queue_name,
        attributes     :     message.Attributes,
        policy         :     message.Policy
    }

    let queue_message         =    new Message(inner_message.metadata,inner_message.body,inner_message.tags)
    queue_message.MessageID   =    inner_message.message_id;
    queue_message.ClientID    =    inner_message.client_id;
    queue_message.Queue       =    inner_message.queue;
    queue_message.Attributes  =    inner_message.attributes;
    queue_message.Policy      =    inner_message.policy;

    return queue_message;
    
}

/**
 * Convert messages to queue Messages request.
 * @param {number} uuid Id for batchRequest.
 * @param {message[]} messages Kubemq message array.
 */
function convertQueueMessageBatchRequest(uuid,messages) {
    let queue_message_batch_request   =    {
        BatchID     :   uuid,
        Messages    :   messages
    }
    return queue_message_batch_request;
}

module.exports=Message;
module.exports.convertQueueMessageBatchRequest=convertQueueMessageBatchRequest;
module.exports.convertToQueueMessage=convertToQueueMessage;
    

