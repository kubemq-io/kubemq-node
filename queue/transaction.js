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
const AsyncLock = require('async-lock')
var kubeClient= require('../basic/grpc_client');


class Transaction{
	/**
	 * 
	 * @param {string} kubemq_address   -   The KubeMQ address full address example :"localhost:50000" (address is localhost , 50000 is port).
	 * @param {MessageQueue} queue 		-   The KubeMQ message queue to create transaction.
	 */
	constructor(kubemq_address=null,queue){
		this.grpc_conn          		=   new kubeClient.GrpcClient(kubemq_address);
		this.queue              		=   queue;
		this.stream             		=   false;
		this.kubemq_address     		=   queue.get_kube;
		this.client             		=   this.grpc_conn.get_kubemq_client();
		this.lock               		=	new AsyncLock();
		this.streamObserver				=	false;
		this.checkCallIsInTransaction  	=  this.checkCallIsInTransaction.bind(this);
	}
    /**
    * Callback for incoming errors.
    *
    * @callback req_handler
    * @param {string} err - received error.
    */
   
	/**
	 * 
	 * @param {number} visibility_seconds 	-  message access lock by receiver.
	 * @param {number} wait_time_seconds    -  Wait time of request, default is from queue.
	 * @param {req_handler} callback 
	 */
	receive(visibility_seconds=1, wait_time_seconds=1,req_handler=null,err_handler=null){
		return new Promise((resolve, reject) =>{
			if (this.openStream()==true){
				reject("stream already open , please call ack")
			}
			let message =  this.queue.createStreamQueueMessageReceiveRequest(visibility_seconds,wait_time_seconds)
			
			this.streamObserver.on("data",req_handler);
			this.streamObserver.on("error",err_handler);
			this.streamObserver.write(message)
			resolve();
		})

	}
	/**
	 * 
	 * @param {number} msg_sequence  -  Received message sequence Attributes.Sequence.
	 */
	ackMessage(msg_sequence){
		return new Promise((resolve, reject) =>{
			if (this.checkCallIsInTransaction()==false){
				reject("no active message to ack, call Receive first")
			}
			let message =  this.queue.createStreamQueueMessageAckRequest(msg_sequence)

			this.streamObserver.write(message)
			resolve();
		})

	}
	/**
	 * 
	 * @param {number} msg_sequence   -  Received message sequence Attributes.Sequence.
	 */
	rejectedMessage(msg_sequence){
		return new Promise((resolve, reject) =>{
			if (this.checkCallIsInTransaction()==false){
				reject("no active message to reject, call Receive first");
			}
			let message =  this.queue.createStreamQueueMessageRejectRequest(msg_sequence)

			this.streamObserver.write(message)
			resolve();
		})

	}
	/**
	 * 
	 * @param {number} visibility_seconds  -  Received message sequence Attributes.Sequence.
	 */
	extendVisibility(visibility_seconds){
		return new Promise((resolve, reject) =>{
			if (this.checkCallIsInTransaction()==false){
				reject("no active message to extend visibility, call Receive first")
			}
			let message =  this.queue.createStreamQueueMessageExtendVisibilityRequest(visibility_seconds)

			this.streamObserver.write(message)
			resolve();
		})

	}

	/**
	 * 
	 * @param {string} queue_name  - Resend queue name.
	 */
	resend(queue_name){
		return new Promise((resolve, reject) =>{
			if (this.checkCallIsInTransaction()==false){
				reject("no active message to resend, call Receive first")
			}
			let message =  this.queue.createStreamQueueMessageResendRequest(queue_name)

			this.streamObserver.write(message)
			resolve();
		})

	}
	/**
	 * Resend the new message to a new channel.
	 * @param {*} p_message 
	 */
	modify(p_message){
		return new Promise((resolve, reject) =>{
			if (this.checkCallIsInTransaction()==false){
				reject("no active message to resend, call Receive first")
			}
			let message =  this.queue.createStreamQueueMessageModifyRequest(p_message)

			this.streamObserver.write(message)
			resolve();
		})

	}
	/**
	 * used internally 
	 */
	openStream(){
		this.lock.acquire("stream",(done)=> {
			if (this.stream == false){
				this.streamObserver		=	this.client.StreamQueueMessage();
				this.stream = true;
				done();
				return false;
			}else{
				done();
				return true;
			}
		});
	}

	/**
	 * used internally by kubemq.
	 */
	closeStream(){
		return new Promise((resolve, reject) =>{
			this.lock.acquire("stream", (done)=> {
				if (this.stream == true){
					this.stream = false;
					this.streamObserver.cancel();
					this.streamObserver=null;				
					done();
					resolve(true);
				}else{
					done();
					console.log("Stream is closed");
					resolve(false);
				}
			});
		})
	}
	/**
	 * used internally by kubemq.
	*/
	checkCallIsInTransaction(){
		this.lock.acquire("stream",(done)=> {
			done();
			return this.stream;
		});
	}
}

module.exports	=	Transaction;