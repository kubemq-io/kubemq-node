const ReceiveMessagesResponse = require('../queue/receive_messages_response')

/**
 * Filled internally. 
 */
class SendMessageBatchResult{
    constructor(send_message_batch_result){

        //Represents Unique identifier for the Request.
        this.BatchID         =    send_message_batch_result.BatchID;

        //Represents if there are any errors in the batch request
        this.HaveErrors      =    send_message_batch_result.HaveErrors;

        //Returned from KubeMQ, false if no error.
        this.Error           =    send_message_batch_result.Error;

        this.MessagesResponse     =    send_message_batch_result.Results;

    }
}

module.exports  =   SendMessageBatchResult;