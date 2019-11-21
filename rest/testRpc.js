var rpcClass = require('./rpc');

var byteConverter = require('../tools/stringToByte');


var rpcCommand = new rpcClass('localhost', 9090, 'cleinq', 'testcmd', '1b12c563-4f8a-49e9-94e1-aa29b7be70d6',
    rpcClass.Type.Query, 60000, undefined, true);

rpcCommand.subscribe(
    (request) => {
        console.log(request);
        let commandResponse = require('../rpc/lowLevel/commandResponse');
        let res = new commandResponse(request, true);
        rpcQuery.sendResponse(res).then((reps) => {
            console.log('executed:' + reps);
        });
    });


    let commandRequest  = require('../rpc/lowLevel/commandRequest');
    let cRequest = new commandRequest(byteConverter.stringToByte('move 1'));

rpcCommand.send(cRequest).then((resp) => {
    console.log(resp)
});

var rpcQuery = new rpcClass('localhost', 9090, 'cleinq', 'testq', '1b12c563-4f8a-49e9-94e1-aa29b7be70d6',

    rpcClass.Type.Query, 60000, undefined, true);

rpcQuery.subscribe(request => {
        console.log(request);
        let queryResponse = require('../rpc/lowLevel/queryResponse');
        let res = new queryResponse.QueryResponse(request,byteConverter.stringToByte('query result:1'));
        rpcQuery.sendResponse(res).then((reps) => {
            console.log('executed:' + JSON.stringify(reps));
        });
    });


    let queryRequest = require('../rpc/lowLevel/queryRequest');
    let qRequest = new queryRequest(byteConverter.stringToByte('give me 1'));
    qRequest.Metadata ='questions';    
rpcQuery.send(queryRequest).then((resp) => {
    console.log(JSON.stringify(resp))
});
