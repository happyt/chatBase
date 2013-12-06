/**
 * Created by Mortoni on 06/12/13.
 */
var dgram = require("dgram");

var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (message, rinfo) {
    console.log("server got: " + message + " from " +
        rinfo.address + ":" + rinfo.port);

    client.send(message, 0, message.length, 11000, "172.20.69.56", function(err, bytes) {

    });

});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});

server.bind(11000);
// server listening