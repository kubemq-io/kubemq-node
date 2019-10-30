class receiveRequest{
    constructor(requestID, maxNumberOfMessages, waitTimeSeconds){
        this.RequestID=requestID;
        this.MaxNumberOfMessages=maxNumberOfMessages;
        this.WaitTimeSeconds= waitTimeSeconds;      
    }
    
}

module.exports = receiveRequest;