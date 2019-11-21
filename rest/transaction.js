const EventEmitter = require('events');
const WebSocket = require('ws');
let ws = undefined;
const StreamRequestType = {
    'StreamRequestTypeUnknown': 0,
    'ReceiveMessage': 1,
    'AckMessage': 2,
    'RejectMessage': 3,
    'ModifyVisibility': 4,
    'ResendMessage': 5,
    'SendModifiedMessage': 6
}
let TranMessage;
let socketOpen =false;
let socketOpening =false;

class transaction extends EventEmitter {
    constructor(kubeMQHost, kubeMQRestPort, client, queueName) {
        super();
        this.kubeMQHost = kubeMQHost;
        this.kubeMQRestPort = isNaN(kubeMQRestPort) ? kubeMQPort.toString() : kubeMQRestPort;
        this.client = client;
        this.queueName = queueName;
        var url = 'ws://';
        url = url.concat(this.kubeMQHost.concat(':', this.kubeMQRestPort));
        url = url.concat('/queue/stream');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.queueName);

        if (this.group !== undefined) {
            url = url.concat('&group=' + Group);
        }
        this.url = url;
    }


    receiveMessage(visibilitySeconds, waitTimeSeconds) {
        if (this.TranMessage !== undefined || socketOpen===true||socketOpening===true) {
            this.emit('error',{Error:'there is still a transaction open'});
            return;
        }
        socketOpening = true;
        var options = {

            headers: {
                'X-Kubemq-Server-Token': '1b12c563-4f8a-49e9-94e1-aa29b7be70d6'
            }
        };

        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ReceiveMessage,
            Channel: this.queueName,
            VisibilitySeconds: visibilitySeconds,
            WaitTimeSeconds: waitTimeSeconds,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }

        var json = JSON.stringify(StreamQueueMessageRequest);
        ws = new WebSocket(this.url, options);
       
        var self = this;
        ws.on('message', function incoming(data) {
            let msg = JSON.parse(data);
            if (msg.IsError) {
                TranMessage = undefined;
                    self.emit('error', msg);
                    return;
            }
            switch (msg.StreamRequestTypeData) {
                case StreamRequestType.ReceiveMessage:
                    TranMessage = msg;
                    self.emit('message', msg);
                    break;
                case StreamRequestType.AckMessage:
                        msg.by = 'AckMessage';
                    self.emit('end',  msg);
                    this.close();
                    break;
                case StreamRequestType.RejectMessage:
                        msg.by = 'RejectMessage';
                    self.emit('end', msg)
                    this.close();
                    break;
               
                case StreamRequestType.ModifyVisibility:                    
                    self.emit('extended', msg)
                    this.close();
                    break;
                case StreamRequestType.ResendMessage:
                        msg.by = 'ResendMessage';
                    self.emit('end', msg)
                    this.close();
                    break;
                case StreamRequestType.SendModifiedMessage:
                        msg.by = 'SendModifiedMessage';
                    self.emit('end', msg)
                    this.close();
                    break;

            }
        });

        ws.on('open', function open() {
            socketOpen =true;
            socketOpening= false;
            ws.send(json, err => {
                if (err !== undefined) {
                    self.emit('error', err);
                }              
            });
        });
        ws.on('close', code => {
            TranMessage = undefined;
            socketOpen = false;
            socketOpening= false;
            self.emit('end', {by:'socket close'})
        });
        ws.on('error', err => {
            self.emit('error', err);
        });



    };

    ackMessage() {

        if (TranMessage === undefined||socketOpen===false) {
            this.emit('error',{Error:'no message in tran'});
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.AckMessage,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        var json = JSON.stringify(StreamQueueMessageRequest);
        var self = this;
        ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    rejectedMessage() {
        if (TranMessage === undefined||socketOpen===false) {
            this.emit('error',{Error:'no message in tran'});
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.RejectMessage,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        var json = JSON.stringify(StreamQueueMessageRequest);
        var self = this;
        ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    extendVisibility(visibility_seconds) {
        if (TranMessage === undefined||socketOpen===false) {
            this.emit('error',{Error:'no message in tran'});
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ModifyVisibility,
            Channel: this.queueName,
            VisibilitySeconds: visibility_seconds,
            WaitTimeSeconds: undefined,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        var json = JSON.stringify(StreamQueueMessageRequest);

        var self = this;
        ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

    resend(queueName) {
        if (TranMessage === undefined||socketOpen===false) {
            this.emit('error',{Error:'no message in tran'});
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ModifyVisibility,
            Channel: queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: null,
        }



        var json = JSON.stringify(StreamQueueMessageRequest);
        var json = JSON.stringify(StreamQueueMessageRequest);
        var self = this;
        ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };

 
    modify(message) {
        if (TranMessage === undefined||socketOpen===false) {
            this.emit('error',{Error:'no message in tran'});
            return;
        }
        let StreamQueueMessageRequest = {
            RequestID: undefined,
            ClientID: this.client,
            StreamRequestTypeData: StreamRequestType.ModifyVisibility,
            Channel: this.queueName,
            VisibilitySeconds: undefined,
            WaitTimeSeconds: undefined,
            RefSequence: TranMessage !== undefined ? TranMessage.Message.Attributes.Sequence : undefined,
            ModifiedMessage: message,
        }



        var json = JSON.stringify(StreamQueueMessageRequest);

        var json = JSON.stringify(StreamQueueMessageRequest);
        var self = this;
        ws.send(json, err => {
            if (err !== undefined) {
                self.emit('error', err);
            }
        });
    };
};


module.exports = transaction;
