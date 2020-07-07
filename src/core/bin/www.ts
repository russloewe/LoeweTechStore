
var app = require('../app');
var express = require('express');
var debug = require('debug')('www:server');
var http = require('http');
var fs = require('fs');
//var https = require('https');

// load ssl credentials 
//var privateKey  = fs.readFileSync('sslcert/private.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');
//var chain = fs.readFileSync('sslcert/ca_bundle.crt', 'utf8');
//if(!privateKey){throw "Missing private SSL keyfile: sslcert/private.key"};
//if(!certificate){throw "Missing cert SSL keyfile: sslcert/certificate.crt"};
//if(!chain){throw "Missing chain SSL keyfile: sslcert/ca_bundle.crt"};
//var credentials = {
//    key: privateKey, 
//    cert: certificate,
 //   ca: chain};

// check for envirenmental variables
//if(!process.env.SITE_URL){throw "Missing SITE_URL env var"};
if(!process.env.DATABASE_URL){throw "Missing DATABASE_URL env var"};
if(!process.env.G_ANALYTICS_KEY){throw "Missing G_ANALYTICS_KEY env var."};
if(!process.env.STRIPE_SERVER){throw "Missing STRIPE_SERVER env var."};
if(!process.env.SITE_URL){throw "No site url"};
if(!process.env.NODE_ENV){throw "No NODE_ENV"};
if(!process.env.ENV){throw "No ENV"};

// load environmental variables
var port: string | number = normalizePort(process.env.PORT || '3000');
var address = process.env.ADDR || '0.0.0.0';
var site_url = process.env.SITE_URL;
app.set('port', port);

var url = process.env.SITE_URL;
//var server = https.createServer(credentials, app).listen(port, address, function () {
//    console.log("Using HTTPS server");
//    console.log('server running on port: ' + port);
 //   console.log('Listening on: ' + address);
//});

// Redirect from http port 80 to https
//var http = require('http');
//http.createServer(function (req, res) {
 //   console.log("Redirectiing:", site_url + req.url);
 //   res.writeHead(301, { "Location":  site_url + req.url });
//    res.end();
//}).listen(8080);


var server = http.createServer(app).listen(port, address, function () {
    console.log("Using HTTP server");
    console.log('server running on port: ' + port);
    console.log('Listening on: ' + address);
});

function normalizePort(val: string) {
    var port: number = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    throw Error("Bad port number");
}
function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
