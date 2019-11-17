var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var PROTO_PATH = __dirname + '/kubemq/grpc/kubemq.proto';
var grpc_proto = {
    get proto() {
        if (this.loadpck==null){
            let proto = grpc.loadPackageDefinition(
                protoLoader.loadSync(PROTO_PATH, {
                  keepCase: true,
                  longs: String,
                  enums: String,
                  defaults: true,
                  oneofs: true
                })
              );
            this.loadpck    =   grpc_proto= grpc.loadPackageDefinition(proto).kubemq;
        }
        return this.loadpck;
    }
};

module.exports={
  grpc_proto
};