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



const kubeClient= require('../../basic/grpc_client')
const EventEmitter = require('events').EventEmitter;


/**
 * Class represents the instance that is responsible to send events to the kubemq.
 */
class Responder extends EventEmitter{
    /**
     * 
     * @param {string} kubeMQ_address - The Kubemq address with grpc port.
     */
    constructor(kubeMQ_address=null){
        super();
        this.grpc_conn = new kubeClient.GrpcClient(kubeMQ_address);
        this.join=null
        this.Stop=this.Stop.bind(this)
    }
    //Register to kubeMQ Channel using handler.
    subscribeToRequests(subscribe_request,req_handler,error_handler){

      
        this.join = this.grpc_conn.get_kubemq_client().SubscribeToRequests(subscribe_request)
        this.join.on("error",error_handler)
        this.join.on("data",req_handler)
    }

    sendResponse(response){
        return new Promise((resolve, reject) =>{

        this.grpc_conn.get_kubemq_client().SendResponse(response, function(err, response) {
                if (err) {
                    reject(response)
                }else{
                    resolve(resolve)
                }
            })
        })
    }

    Stop(){
        console.log(`Stop was called`);
        this.join.cancel()
    }
    
    ping(){
        return new Promise((resolve, reject) =>{

                this.grpc_conn.get_kubemq_client().Ping({}, function(err, response) {
                if (err) {
                    reject (new Error(err))
                }else{
                    resolve(response)
                }
            })
        })
    }
    
}

module.exports =Responder;