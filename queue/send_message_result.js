/* MIT License

Copyright (c) 2018 KubeMQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

/**
 * filled internally by kubemq.
 */
class SendMessageResult{
    constructor(send_message_result){

        //Represents Unique identifier for the Request.
        this.MessageID         =    send_message_result.MessageID || 0;

        //Represents when the message is expired.
        this.ExpirationAt      =    send_message_result.ExpirationAt || 0;

        //Returned from KubeMQ, false if no error.
        this.IsError           =    send_message_result.IsError;
        if (send_message_result.SentAt){
            this.SentAt            =    new Date(Number(send_message_result.SentAt.slice(0, 10))*1000);
        }else{
            this.SentAt            =    0;
        }

        //Represents if the message was delayed.
        this.DelayedTo         =    send_message_result.DelayedTo || 0;

        //Error message, valid only if IsError true.
        this.Error              =    send_message_result.Error;

    }
}




module.exports=SendMessageResult;