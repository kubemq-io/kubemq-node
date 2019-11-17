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

var configuration_loader= require('./configuration_loader')
var proto_loader = require('../protos/proto_setup')
var grpc = require('grpc');
// var grpc= require('grpc')
var fs = require('fs');

class GrpcClient{
    constructor(_kubemq_address=null){
        this._init_registration.bind(this)
        this._kubemq_address=_kubemq_address
        this.get_kubemq_client.bind(this)
        this._client=null
    }

    get_kubemq_client(){
        if (this._client ===null){
            if(this._kubemq_address===null){
                this._kubemq_address=this.get_kubemq_address()
            }
            
            let client_cert_file=configuration_loader.get_certificate_file()
            if (client_cert_file!=null){
                let contents = fs.readFileSync(client_cert_file, 'utf8');
                let proto=proto_loader.grpc_proto.proto;
                this._client=new proto.service.kubemq(this._kubemq_address,
                    grpc.credentials.createSsl(contents));
            }else{
                let proto=proto_loader.grpc_proto.proto;
                this._client=new proto.service.kubemq(this._kubemq_address,
                    grpc.credentials.createInsecure());
            }
        }
        return this._client
    }


    get_kubemq_address(){
        if(this._kubemq_address!=null){
            return this._kubemq_address
        }

        this._kubemq_address=configuration_loader.get_server_address()
        if (this._kubemq_address ===null){
            throw "Server Address was not supplied"
        }
        return this._kubemq_address
        
    }

    _init_registration(){
        let registration_key=configuration_loader.get_registration_key()
        if (registration_key!=null){
            this._metadata=[("X-Kubemq-Server-Token", registration_key)]
        }
    }
}

module.exports ={GrpcClient};