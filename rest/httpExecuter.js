const http = require('http'),
    https = require('https'),
    fs = require('fs');

exports.getRequest = ((requestBody, options) => {



    return new Promise((resolve, reject) => {
       
        let request = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks).toString();
                resolve(JSON.parse(body));
            });
        });

        if (typeof requestBody !== 'undefined') {
            request.write(JSON.stringify(requestBody));
        }
        request.end();
    });
});

exports.getHttpsRequest = ((requestBody, options) => {



    return new Promise((resolve, reject) => {

       
        options.rejectUnauthorized = false;
        let request = https.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks).toString();
                resolve(JSON.parse(body));
            });
        });

        if (typeof requestBody !== 'undefined') {
            request.write(JSON.stringify(requestBody));
        }
        request.end();
    });
});