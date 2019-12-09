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

const kubeClient= require('../../basic/grpc_client');


class Sender{
    /**
     * Sender: responsible to send event to kubemq .
     * @param {string} kubemq_address   -   address to kubemq as string example:"localhost:50000".
     */
    constructor(kubemq_address=null){
        this.grpc_conn    =   new kubeClient.GrpcClient(kubemq_address);
        this.stream       =   null;
    }

    /**
     * Publish a single event to kubemq.
     * @param {Event} event - kubemq event.
     */
    sendEvent(event){
        return new Promise((resolve, reject) =>{
            //validation   
            if(event.Body == undefined){
                    reject(new Error('event has no body'));
                }
                this.grpc_conn.get_kubemq_client().SendEvent(event, function(err, response) {
                if (err) {
                    reject (new Error(err));
                }else{
                    resolve(response);
                }
            })
        })
    }

    /**
     * stream event to kubemq using event emitter.
     * @param {EventEmitter} event_emitter 
     */
    streamEvent(event_emitter){

        event_emitter.on('message', (data)=> {           
                this.stream.write(data);
            })

            this.stream    =    this.grpc_conn.get_kubemq_client().SendEventsStream();
    }

    //ping check connection to the kubemq.
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
}


module.exports =Sender;