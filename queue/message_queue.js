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

var kubeClient = require('../basic/grpc_client');
const SendMessageResult = require('./send_message_result')
var id_gen = require("../tools/id_generator");
const ReceiveMessagesResponse = require('../queue/receive_messages_response')
const SendMessageBatchResult = require('../queue/send_batch_message_result')
const Message  = require('./message')
var Transaction = require('./transaction')
const streamRequest = require('./stream_request_type')


/**
* Create an MessageQueue.
* @param {string} kubemq_address                       -     The KubeMQ address full address example :"localhost:50000" (address is localhost , 50000 is port).
* @param {string} queue_name                           -     The name of the queue to send messages.
* @param {string} client_id                            -     The publisher ID, for tracing.
* @param {string} max_number_of_messages               -     The max number of messages to be able to send to the queue.
* @param {string} wait_time_seconds_queue_messages     -     The wait time in seconds to receive messages from queue.
*/
class MessageQueue{
    constructor(kubemq_address=null,queue_name,client_id,max_number_of_messages=32,wait_time_seconds_queue_messages=1){


        this.grpc_conn                          =   new kubeClient.GrpcClient(kubemq_address);
        this.queue                              =   queue_name;
        this.client_id                          =   client_id;
        this.max_number_of_messages             =   max_number_of_messages;
        this.wait_time_seconds_queue_messages   =   wait_time_seconds_queue_messages;
        if(kubemq_address){
            this.kubemq_address=kubemq_address;
        }
        this.transaction   =    null;
    }
    /**
    * Create a Transaction.
    */
    createTransaction(){
        if(this.transaction === null || this.transaction.streamObserver===null){
            this.transaction    =   new Transaction(this.kubemq_address,this);
        }       
        
        return this.transaction;
    }

    /**
    * send queue message using kubemq.
    * @param {Message} message        -     message to send to kubemq.
    */
    sendQueueMessage(message){
        return new Promise((resolve, reject) =>{
            if(message.Channel==null){
                message.Channel       =  this.queue;
            }
            if(message.ClientID==null){
                message.ClientID    =   this.client_id;
            }
            this.grpc_conn.get_kubemq_client().SendQueueMessage(message, function(err, response) {
                    if (err) {
                        reject(new Error(err));
                    }else{
                        resolve(new SendMessageResult(response));
                    }
                });
        });
    }

    /**
    * send batch messages using kubemq.
    * @param {Message[]} messages        -     array of messages to send using kubemq.
    */
    sendQueueMessageBatch(messages){
        let id               =   id_gen.get_next_id();
        let message_array    =   [];
        messages.forEach(message => {
            if(message.Channel==null){
                message.Channel     =  this.queue;
            }
            if(message.ClientID==null){
                message.ClientID    =   this.client_id;
            }
            message_array.push(message);
        });
        return new Promise((resolve, reject) =>{
            let batchRequests       = new Message.convertQueueMessageBatchRequest(id,message_array);
            this.grpc_conn.get_kubemq_client().SendQueueMessagesBatch(batchRequests, function(err, response) {
                    if (err) {
                        reject(new Error(err));
                    }else{
                        resolve(new SendMessageBatchResult(response));
                    }
                });
            });
    }

    /**
    * receive Messages from kubemq
    * @param {number} number_of_messages        -     number of messages to return from kubemq.
    * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
    */
    receiveQueueMessages(number_of_messages=null,wait_time_seconds=null){
        if (wait_time_seconds == null){
            wait_time_seconds == this.wait_time_seconds_queue_messages;
        }
        let id                      =   id_gen.get_next_id();
        let queue_messages_request  =  this.convertToReceiveQueueMessagesRequest(id,false,number_of_messages,wait_time_seconds);
        return new Promise((resolve, reject) =>{
            this.grpc_conn.get_kubemq_client().ReceiveQueueMessages(queue_messages_request , function(err, response) {
                if (err) {
                    reject(new Error(err));
                }else{
                    resolve(new ReceiveMessagesResponse(response));
                }
            });
        })
    }

    /**
    * Return the first X messages of the queue without dequeue.
    * @param {number} number_of_messages        -     number of messages to return from kubemq.
    * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
    */
    peekQueueMessage(number_of_messages=null,wait_time_seconds=null){
        if (wait_time_seconds == null){
            wait_time_seconds == this.wait_time_seconds_queue_messages;
        }
        let id                      =   id_gen.get_next_id();
        let queue_messages_request  =  this.convertToReceiveQueueMessagesRequest(id,true,number_of_messages,wait_time_seconds);
        return new Promise((resolve, reject) =>{
            this.grpc_conn.get_kubemq_client().ReceiveQueueMessages(queue_messages_request , function(err, response) {
                if (err) {
                    reject(new Error(err));
                }else{
                    resolve(new ReceiveMessagesResponse(response));
                }
            });
        })
    }

    /**
    * Purge all messages from queue.
    */
    ackAllQueueMessages(){
        let ackAllRequest  =  this.convertToAckAllQueueMessageRequest(this.wait_time_seconds_queue_messages);
        return new Promise((resolve, reject) =>{
            this.grpc_conn.get_kubemq_client().AckAllQueueMessages(ackAllRequest , function(err, response) {
                if (err) {
                    reject(new Error(err));
                }else{
                    resolve(new ReceiveMessagesResponse(response));
                }
            });
        })
    }

    /**
    * send ping to kubemq to check connection
    */
    ping(){
        return new Promise((resolve, reject) =>{

                this.grpc_conn.get_kubemq_client().Ping({}, function(err, response) {
                if (err) {
                    reject (new Error(err));
                }else{
                    resolve(response);
                }
            })
        })
    }




    convertToAckAllQueueMessageRequest(wait_time_seconds){
        let AckAllQueueMessagesRequest  =   {
            RequestID          :   id_gen.get_next_id(),
            ClientID           :   this.client_id,
            Channel            :   this.queue,
            WaitTimeSeconds    :   wait_time_seconds,
        }
        return AckAllQueueMessagesRequest;
    }

    convertToReceiveQueueMessagesRequest(request_id,is_peek=false,max_number_of_messages=null,wait_time_seconds=null){

        if(max_number_of_messages===null){
            max_number_of_messages  =   this.max_number_of_messages;
        }

        let ReceiveQueueMessagesRequest =   {
            RequestID               :   request_id,
            ClientID                :   this.client_id,
            Channel                 :   this.queue,
            MaxNumberOfMessages     :   max_number_of_messages,
            IsPeak                  :   is_peek,
            WaitTimeSeconds         :   wait_time_seconds
        }
        return ReceiveQueueMessagesRequest;
    }


    createStreamQueueMessageReceiveRequest(visibility_seconds, wait_time_seconds=null){
        let StreamQueueMessageRequest    =   {
            ClientID                :   this.client_id,
            Channel                 :   this.queue,
            RequestID               :   id_gen.get_next_id(),
            StreamRequestTypeData   :   Number(streamRequest.ReceiveMessage),
            VisibilitySeconds       :   visibility_seconds,
            WaitTimeSeconds         :   wait_time_seconds || this.queue.wait_time_seconds,
            ModifiedMessage         :   null,
            RefSequence             :   0
        }
        return StreamQueueMessageRequest;
        
    }
    createStreamQueueMessageAckRequest(msg_sequence){
        let StreamQueueMessagesRequest  =   {
            ClientID                 :   this.client_id,
            Channel                  :   this.queue,
            RequestID                :   id_gen.get_next_id(),
            StreamRequestTypeData    :   Number(streamRequest.AckMessage),
            VisibilitySeconds        :   0,
            WaitTimeSeconds          :   0,
            ModifiedMessage          :   null,
            RefSequence              :   msg_sequence
        }
        return StreamQueueMessagesRequest;
    }

    createStreamQueueMessageRejectRequest(msg_sequence){
        let StreamQueueMessagesRequest  =   {
            ClientID                 :   this.client_id,
            Channel                  :   this.queue,
            RequestID                :   id_gen.get_next_id(),
            StreamRequestTypeData    :   Number(streamRequest.RejectMessage),
            VisibilitySeconds        :   0,
            WaitTimeSeconds          :   0,
            ModifiedMessage          :   null,
            RefSequence              :   msg_sequence
        }
        return StreamQueueMessagesRequest;
    }

    createStreamQueueMessageExtendVisibilityRequest(visibility){
        let StreamQueueMessagesRequest  =   {
            ClientID                 :   this.client_id,
            Channel                  :   this.queue,
            RequestID                :   id_gen.get_next_id(),
            StreamRequestTypeData    :   Number(streamRequest.ModifyVisibility),
            VisibilitySeconds        :   visibility,
            WaitTimeSeconds          :   0,
            ModifiedMessage          :   null,
            RefSequence              :   0
        }
        return StreamQueueMessagesRequest;
    }

    createStreamQueueMessageResendRequest(queue_name){
        let StreamQueueMessagesRequest  =   {
            ClientID                 :   this.client_id,
            Channel                  :   queue_name,
            RequestID                :   id_gen.get_next_id(),
            StreamRequestTypeData    :   Number(streamRequest.ResendMessage),
            VisibilitySeconds        :   0,
            WaitTimeSeconds          :   0,
            ModifiedMessage          :   null,
            RefSequence              :   0
        }
        return StreamQueueMessagesRequest;
    }

    createStreamQueueMessageModifyRequest(message){
        let StreamQueueMessagesRequest  =   {
            ClientID                 :   this.client_id,
            Channel                  :   "",
            RequestID                :   id_gen.get_next_id(),
            StreamRequestTypeData    :   Number(streamRequest.SendModifiedMessage),
            VisibilitySeconds        :   0,
            WaitTimeSeconds          :   0,
            ModifiedMessage          :   message,
            RefSequence              :   0
        }
        return StreamQueueMessagesRequest;
    }

}


module.exports    =    MessageQueue;