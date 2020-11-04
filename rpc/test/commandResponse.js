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

/** Class representing a Command Response to replay after the command has been executed. */
class CommandResponse{
    /**
     * 
     * @param {CommandRequest} request - The received command by CommandReceiver.
     * @param {boolean} executed - The command execution status.
     */
    constructor(request, executed) {

        //Represents if the response was executed.
        this.Executed = executed;
        //Represents a Response identifier.
        this.RequestID = request.RequestID;
        //Channel name for the Response. Set and used internally by KubeMQ server.
        this.ReplyChannel = request.ReplyChannel;
        //Represents if the response was received from Cache.
        this.CacheHit = request.CacheHit;
        //Represents if the response Time.
        this.Timestamp = request.Timestamp;
        //Error message
        this.Error = request.Error;
        //Represents key value pairs that help distinguish the message
        this.Tags = undefined;

    }
}

module.exports = CommandResponse;