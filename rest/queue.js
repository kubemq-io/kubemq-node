
const http = require('http');
const httpExec = require('./httpExecuter');
var options;

/**
 * Class representing a queue pattern on Rest. 
 */
class Queue {
    /**
    * @param {string} kubeMQHost - The KubeMQ address.
    * @param {number} kubeMQRestPort - The KubeMQ Rest exposed port.
    * @param {string} client - The publisher ID, for tracing.
    * @param {string} queueName - The queue name.
    * @param {string} kubeMQToken - The authentication Key from KubeMQ.io.
    * @param {string} group - Non mandatory group for round robin subscription.
    * @param {number} maxReceive - Default number of dequeue messages in request.
    * @param {number} waitTime - Default listening time in seconds for requests.
    * @param {boolean} isSecure - Using TLS secure KubeMQ.
    */
    constructor(kubeMQHost, kubeMQRestPort, client, queueName, kubeMQToken, group, maxReceive = 32, waitTime = 1, isSecure) {
        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort = isNaN(kubeMQRestPort) ? kubeMQPort.toString() : kubeMQRestPort;
        this.queueName = queueName;
        this.client = client;
        this.kubeMQToken = kubeMQToken;
        this.isSecure = isSecure;
        this.group = group;
        this.max_number_of_messages = maxReceive;
        this.wait_time_seconds_queue_messages = waitTime;

        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json', 'x-kubemq-server-token': this.kubeMQToken }
        };
    }

    /**
     * send queue message using KubeMQ.
     * @param {Message} message        -     message to send to KubeMQ.
     */
    send(message) {

        message.Channel = this.queueName;
        message.ClientId = this.client;

        options.method = 'POST';
        options.path = '/queue/send';

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    };

    /**
    * send batch messages using KubeMQ.
    * @param {Message[]} messages        -     array of messages to send using KubeMQ.
    */
    sendBatch(messages) {

        options.method = 'POST';
        options.path = '/queue/send_batch';

        messages.forEach(element => {
            //validation
            element.Channel = this.queueName;
            element.ClientId = this.client;
        });

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }
    }

   /**
    * receive Messages from KubeMQ
    * @param {number} maxReceive        -     number of messages to return from KubeMQ.
    * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
    */
    receive(max_number_of_messages, wait_time_seconds) {

        options.method = 'POST';
        options.path = '/queue/receive';

        request = {
            ClientID: this.client,
            Channel: this.queueName,
            MaxNumberOfMessages: max_number_of_messages === undefined ? this.max_number_of_messages : max_number_of_messages,
            IsPeak: false,
            WaitTimeSeconds: wait_time_seconds === undefined ? this.wait_time_seconds : wait_time_seconds,
        };

        if (this.isSecure) {
            return httpExec.getHttpsRequest(request, options);

        } else {

            return httpExec.getRequest(request, options);
        }
    }

    /**
    * Return the first X messages of the queue without dequeue.
    * @param {number} number_of_messages        -     number of messages to return from KubeMQ.
    * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
    */
    peek(max_number_of_messages, wait_time_seconds) {

        options.method = 'POST';
        options.path = '/queue/receive/';

        request = {
            ClientID: this.client,
            Channel: this.queueName,
            MaxNumberOfMessages: max_number_of_messages === undefined ? this.max_number_of_messages : max_number_of_messages,
            IsPeak: true,
            WaitTimeSeconds: wait_time_seconds === undefined ? this.wait_time_seconds : wait_time_seconds,


        };

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }
    }

    /**
    * Purge all messages from queue.
    */
    ackAllMessages() {

        options.method = 'POST';
        options.path = '/queue/ack_all';
        let request = {
            Channel: this.queueName,
            ClientId: this.client
        };
        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }

    }

    /**
    * send ping to KubeMQ to check connection
    */
    ping() {

        options.method = 'GET';
        options.path = '/ping';

        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(event, options);
        }
    }
}

module.exports = Queue;

