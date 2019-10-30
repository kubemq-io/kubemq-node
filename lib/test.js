 var queue= require('./tempQueue');
var msg = require('./message');
var dequeue = require('./receiveRequest');

 var q = new queue('tempclient', 'queuetempname','localhost',9090);


q.sendm(new msg('newmt','QmF0Y2ggTWVzc2FnZSAw')).then(res => {
console.log(res);
});


//  q.send(new msg('newmt','QmF0Y2ggTWVzc2FnZSAw'),function (reps){
//     console.log(reps);
    
// });

// q.recive(new dequeue(1,1,10), function (reps){
//     console.log(reps);
// });

// q.peek(new dequeue(1,1,1,), function (reps){
//     console.log(reps);
//  } );

//  q.ackAllMessages(function (reps){
//     console.log(reps);
//  } );

//   var msgs = [ ];
//  for (let index = 0; index < 2; index++) {
//      msgs.push(new msg('metdatat'+ index,'QmF0Y2ggTWVzc2FnZSAw'))
     
//  }
 
//  q.sendBatch(msgs, function (reps){
//     console.log(reps);
//  } );



 