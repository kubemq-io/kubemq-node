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
const Initiator=require('../lowLevel/initiator')
const Request= require('../lowLevel/queryRequest')
const ChannelParameters = require('./channelParameters')


class Channel{
    constructor(params){
        this.channel_name               =       params.channel_name;
        this.client_id                  =       params.client_id;
        this.timeout                    =       params.timeout;
        this.cache_key                  =       params.cache_key;
        this.cache_ttl                  =       params.cache_ttl;
        this.request_type               =       params.request_type
        this.kubemq_address             =       params.kubemq_address;
        this.sendEvent                  =       this.sendRequest.bind(this);   
        
        if (!this.channel_name){
            throw new Error("channel_name argument is mandatory")
        }

        if (!this.request_type){
            throw new Error("request_type argument is mandatory")
        }

        if (!this.timeout){
            throw new Error("timeout argument is mandatory")
        }
        this.Initiator= new Initiator(params.kubemq_address)
        
    }
    //Publish a single request to kubemq.
    sendRequest(request){
        return new Promise((resolve, reject) =>{
           var req = Request

            let low_level_request = this.createLowLevelRequest(request)
            this.Initiator.sendRequest(low_level_request).then(Response=>{
                resolve(Response)
            })
        })
    }

    createLowLevelRequest(request,override_params=null){
        let req=new Request(request.request_id,this.request_type,this.client_id,this.channel_name,null
            ,request.metadata,request.body,this.timeout,this.cache_key,this.cache_ttl)
        if(override_params){
            if(override_params.timeout){
                req.timeout=override_params.timeout
            }
            if (override_params.cache_key) {
                req.cache_key=override_params.cache_key
            }
            if(override_params.cache_ttl){
                req.cache_ttl=override_params.cache_ttl
            }
        }
        return req
    }
}


module.exports =Channel,ChannelParameters;