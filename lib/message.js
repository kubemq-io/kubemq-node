class message{
    constructor(metaData, body, tags, policy=null){
        this.Metadata=metaData;
        this.Body=body;
        this.Tags = tags;
        this.Policy = policy;
    }
    
    AddExpiration(expiration){
        if (this.Policy===null){
            this.Policy = {ExpirationSeconds: expiration};
        } else {            
        this.Policy.ExpirationSeconds = expiration;
        }   
    }
    AddDelay(delay){        
        if (this.Policy===null){
            this.Policy = {DelaySeconds: delay};
        } else {
        this.Policy.DelaySeconds = delay;
        }
    }
    AddMaxReceiveCount(maxRecive, maxReciveQueueName){
        if (this.Policy===null){
            this.Policy = {MaxReceiveCount: maxRecive};
        } else {
        this.Policy.MaxReceiveCount = maxRecive;
        this.Policy.MaxReceiveQueue = maxReciveQueueName;
        } 
    }
    
}

module.exports = message;
