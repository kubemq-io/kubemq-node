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

/** Class representing a Query Request to the query receiver. */
class QueryRequest {
    /**
     * 
     * @param {bytes} body - The content of the Request.
     */
    constructor(body) {       
        //Represents a Request identifier.
        this.RequestID  =  undefined;
        //Represents metadata for a Request.
        this.Metadata   =  undefined;
        //Internal KubeMQ cache for result.  
        this.CacheKey   =  undefined;
        //Internal KubeMQ cache TTL store for result. 
        this.CacheTTL   =  undefined;
        //Response timeout. 
        this.Timeout    =  undefined;
        //Represents the content of the Request.
        this.Body       =  body;      
        //Represents key value pairs that help distinguish the message
        this.Tags       =  undefined; 
     
    }

}

module.exports=QueryRequest;
   