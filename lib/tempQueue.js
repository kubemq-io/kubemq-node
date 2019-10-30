class queue{
    constructor(client, queueName, kubeMQHost, kubeMQport){
        this.client =client;
        this.queueName = queueName;
        this.kubeMQHost = kubeMQHost;
        this.kubeMQport = kubeMQport;        
    }
    
    
    sendm(message){
         var http = require("http");

        var options = {
        "method": "POST",
        "host":  this.kubemqHost,
        "port":   this.kubeMQport,
        "path": "/queue/send/",
        "headers": {"Content-Type": "application/json"}
        };
    
        var url = this.kubeMQHost +':'+ this.kubeMQport;
        ///validate message

        message['Channel']=this.queueName;
        message['ClientId'] = this.client;
        return new Promise(function(resolve, reject) { 
            // do the usual XHR stuff 
        var sendreq = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
              var body = Buffer.concat(chunks).toString();
            var sendresponse= require('./sendResponse');
             var resp = new sendresponse(JSON.parse(body));
            resolve(body);                 
        });
        });
        
        sendreq.write(JSON.stringify({message}));
        sendreq.end();
        });    
    };

    send(message, callback){
        
        var http = require("http");

        var options = {
        "method": "POST",
        "host":  this.kubemqHost,
        "port":   this.kubeMQport,
        "path": "/queue/send/",
        "headers": {"Content-Type": "application/json"}
        };

        var sendresponse= require('./sendResponse');
        console.log(sendresponse);
        
      var sendreq = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
              var body = Buffer.concat(chunks).toString();
             var resp = new sendresponse(JSON.parse(body));
            callback (resp);                   
        });
        });
        
        message['Channel']=this.queueName;
        message['ClientId'] = this.client;

        sendreq.write(JSON.stringify({message}));
        sendreq.end();
    };

    sendBatch(messages, callback){
        var http = require("http");

        var options = {
        "method": "POST",
        "host":  this.kubemqHost,
        "port":   this.kubeMQport,
        "path": "/queue/send/",
        "headers": {"Content-Type": "application/json"}
        };

        var sendresponse= require('./sendResponse');
        console.log(sendresponse);
        
      var sendreq = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
              var body = Buffer.concat(chunks).toString();
             var resp = new sendresponse(JSON.parse(body));
            callback (resp);                   
        });
        });
        
        messages.forEach(element => {
            element.Channel = this.queueName;
            element.ClientId = this.client;
        });
        sendreq.write(JSON.stringify({messages}));
        sendreq.end();

    }

    recive(request , callback){
    var http = require("http");

    var options = {
    "method": "POST",
    "host":  this.kubemqHost,
    "port":   this.kubeMQport,
    "path": "/queue/receive",
    "headers": {    "Content-Type": "application/json"}
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks).toString();
         var sendresponse= require('./receiveResponse');

        console.log(body.toString());
        callback(new sendresponse(JSON.parse(body)));
    });
    });
   
        request['Channel']=this.queueName;
        request['ClientId'] = this.client;
        request['IsPeak'] = false;
        

    req.write(JSON.stringify(request));
    req.end();

    }
    peek(request , callback){
    var http = require("http");

        var options = {
        "method": "POST",
        "host":  this.kubemqHost,
        "port":   this.kubeMQport,
        "path": "/queue/receive",
        "headers": {    "Content-Type": "application/json"}
        };

        var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks).toString();
            var sendresponse= require('./receiveResponse');

            console.log(body.toString());
            callback(new sendresponse(JSON.parse(body)));
        });
        });

    
            request['Channel']=this.queueName;
            request['ClientId'] = this.client;
            request['IsPeak'] = true;
            

        req.write(JSON.stringify(request));
        req.end();
    }
    ackAllMessages(callback){
        var http = require("http");

        var options = {
        "method": "POST",
        "host":  this.kubemqHost,
        "port":   this.kubeMQport,
        "path": "/queue/ack_all",
        "headers": {    "Content-Type": "application/json"}
        };

        var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks).toString();
            var sendresponse= require('./receiveResponse');

            console.log(body.toString());
            callback(new sendresponse(JSON.parse(body)));
        });
        });

     var request = {
     Channel :this.queueName,
     ClientId :this.client};
                      
            

        req.write(JSON.stringify(request));
        req.end();
    }
    ping(){
 
    }
}

module.exports = queue;
