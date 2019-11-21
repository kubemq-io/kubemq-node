const WebSocket = require('ws');
var httpExec = require('./httpExecuter');
class PubSub {
    constructor(kubeMQHost, kubeMQRestPort, client, channelName, kubeMQToken, useStorage, group, isSecure) {

        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort =  isNaN(kubeMQRestPort)? kubeMQPort.toString() : kubeMQRestPort ;
        this.channelName = channelName;
        this.client = client;
        this.store = useStorage;
        this.kubeMQToken = kubeMQToken;
        this.isSecure = isSecure;
        this.group = group;
    }

    send(event) {

        var options;
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json', 'x-kubemq-server-token': this.kubeMQToken }
        };


        event.Channel = this.channelName;
        event.ClientId = this.client;

        options.method = 'POST';

        options.path = '/send/event';

        event.store = this.store;

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    };


    subscribe(subscriberToEvents, storeProperties) {

        const options = {

            headers: {
                'X-Kubemq-Server-Token': this.kubeMQToken
            }
        };

        var url = 'ws://';
        url = url.concat(this.kubeMQHost.concat(':', this.kubeMQPort));
        url = url.concat('/subscribe/events');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.channelName);

        if (this.group !== undefined) {
            url = url.concat('&group=' + Group);
        }

        if (!this.store) {
            url = url.concat('&subscribe_type=events');
        }
        else {
            url = url.concat('&subscribe_type=events_store');
            url = url.concat('&events_store_type_data=' + storeProperties.Type);
            url = url.concat('&events_store_type_value=' + storeProperties.Value);
        }


        const ws = new WebSocket(url, options)

        ws.on('open', function open() {
            console.log('open');
        });

        ws.on('message', function incoming(data) {
            subscriberToEvents(data);
        });
    }
}

module.exports = PubSub;

module.exports.StoreProperties =class {
    EventStoreType  = {
        StartNewOnly: 1,
        StartFromFirst: 2,
        StartFromLast: 3,
        StartAtSequence: 4,
        StartAtTime: 5,
        StartAtTimeDelta: 6
    };
    EventStoreValue= undefined;
};