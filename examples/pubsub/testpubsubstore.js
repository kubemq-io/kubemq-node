const kubemq = require('../../kubemq');

let channelName = 'sub', clientID = 'hello-testing_event_channel-subscriber',
    kubeMQHost = 'localhost', kubeMQGrpcPort = 50000;

//Store
let storeSub = new kubemq.StoreSubscriber(kubeMQHost, kubeMQGrpcPort, clientID + 'store', channelName);

storeSub.subscribeToEvents(msg => {
        console.log(`msg:${msg.Metadata}`)
    },
    err => {
        console.log(`error:${err}`)
    },

    kubemq.EventStoreType.StartFromFirst, '1');

let storePub = new kubemq.StorePublisher(kubeMQHost, kubeMQGrpcPort, clientID + 'sender', channelName);

let eventStore = new kubemq.StorePublisher.Event('test');
eventStore.Metadata = "test store";

storePub.send(eventStore).then(
    res => {
        console.log(res);
    }).catch(
    err => {
        console.log(`error sending:${err}`)
    });
