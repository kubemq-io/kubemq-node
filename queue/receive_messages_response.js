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
 * Filled internally by kubemq. 
 */
class ReceiveMessagesResponse{
    constructor(receive_message_response){

        //Represents Unique identifier for the Request.
        this.RequestID             =    receive_message_response.RequestID;

        //Returned from KubeMQ, false if no error.
        this.IsError               =    receive_message_response.IsError;

        //Error message, valid only if IsError true.
        this.Error                 =    receive_message_response.Error;

        //if the request was peekRequest.
        this.IsPeek                =    receive_message_response.IsPeak;
        
        //Return the messages from kubemq.
        this.Messages              =    receive_message_response.Messages;

        //Check if messages was expired
        this.MessagesExpired       =    receive_message_response.MessagesExpired;

        //Check if message was received
        this.MessagesReceived      =    receive_message_response.MessagesReceived;

    }
}




module.exports=ReceiveMessagesResponse;