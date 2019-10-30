class receiveResponse{
    constructor(data){
         this.is_error = data.is_error;
         this.message = data.message;
         this.data = JSON.parse(data.data);
    }
}

module.exports = receiveResponse;