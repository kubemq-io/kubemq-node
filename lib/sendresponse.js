class sendresponse {
    constructor(data) {
        this.is_error = data.is_error,
            this.message = data.message,
            this.messageID = data.messageID,
            this.sentAt = data.sentAt,
            this.expiratiopnAt = data.expiratiopnAt,
            this.delayedTo = data.delayedTo;
    }
}

module.exports= sendresponse