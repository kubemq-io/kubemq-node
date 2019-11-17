class ChannelParameters{
    constructor(channel_name=null,client_id=null,timeout=null,cache_key=null,cache_ttl=null,request_type=null,kubemq_address=null){
        //Represents The channel name to send to using the KubeMQ.
        this.channel_name   =    channel_name;


        //Represents the sender ID that the messages will be send under.
        this.client_id      =    client_id;


        //Represents the limit for waiting for response (Milliseconds).
        this.timeout        =    timeout;


        //Represents if the request should be saved from Cache and under what "Key"(str) to save it."
        this.cache_key      =    cache_key;


        //Cache time to live : for how long does the request should be saved in Cache."
        this.cache_ttl      =    cache_ttl;


        //Represents the type of request operation.
        this.request_type   =    request_type;

        //Represents The address of the KubeMQ server.
        this.kubemq_address =    kubemq_address;

    }

}

module.exports.ChannelParameters = ChannelParameters;