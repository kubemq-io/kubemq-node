const tarn = require('./transaction')


let transaction = new tarn('localhost', 9090, 'trte', 'testQueue');


transaction.on('error',err =>{
    console.log('Error'+err.Error);
});

transaction.on('end',mod =>{
    console.log('end transaction by:'+ mod.by);   
    transaction.receiveMessage(1,10);
});
transaction.addListener('extended',ack =>{
    console.log(ack);
});

transaction.on('message',msg => {
    console.log(msg);
    if(msg.IsError){
        console.log('error'+msg);
        return;
    }
 // transaction.extendVisibility(40);
    if (workOnMSG(msg)) {
      transaction.ackMessage();
    }else{
        transaction.rejectedMessage();
    };     
});


transaction.receiveMessage(1, 1);

var counter = 1;
function workOnMSG(msg) {
  
    if (msg.Message.Attributes.Sequence !== 220) {
        console.log('worked on msg'+ counter++);
        return true;
    }
    else {
        return false;
    }

};


