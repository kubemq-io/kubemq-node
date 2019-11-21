const WebSocket = require('./node_modules/ws');
var httpExec = require('./httpExecuter');
var ws;
var options;

class rpc {

    constructor(kubeMQHost, kubeMQRestPort, client, channelName,kubeMQToken, type, defaultTimeout, group, isSecure) {

        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort = isNaN(kubeMQRestPort)? kubeMQPort.toString() : kubeMQRestPort ;
        this.channelName = channelName;
        this.defaultTimeout = defaultTimeout;
        this.client = client;
        this.type = type;
        this.kubeMQToken = kubeMQToken;
        this.isSecure = isSecure;
        this.group = group;
      
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json', 'x-kubemq-server-token': this.kubeMQToken }
        };
    }


    send(command) {
        command.Channel = this.channelName;
        command.ClientId = this.client;       

        command.RequestTypeData = this.type;
       
        if (command.Timeout === undefined) {
            command.Timeout = this.defaultTimeout;
        }

        options.method = 'POST';

        options.path = '/send/request';
      

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    }

    subscribe(responder) {

      
        
        var url = 'ws://';     
        url = url.concat(this.kubeMQHost+':'+this.kubeMQPort);
        url = url.concat('/subscribe/requests');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.channelName);

        if (this.group!==undefined){
        url = url.concat('&group=' + Group);
        }

        if (this.type === 1){
        url = url.concat('&subscribe_type='+'commands')
        } else {
            url = url.concat('&subscribe_type='+'queries')
        }

       

         ws = new WebSocket(url, options);

        ws.on('open', function open() {
            console.log('open');
        });

        ws.on('message', function incoming(data) {
            responder(JSON.parse(data));
        });
    }

    unsubscribe(){
        if( ws != undefined){
            ws.close();
        }
    }


    sendResponse(response) {

        var options;
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json', 'x-kubemq-server-token': this.kubeMQToken }
        };

        response.ClientId = this.client;

        options.method = 'POST';

        options.path = '/send/response';
        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    }

}

module.exports = rpc;
module.exports.Type = {
    Command: 1,
    Query: 2
};