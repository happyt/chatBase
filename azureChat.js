
//make sure you keep this order
// var express = require("express");
// var app = express();
// var http = require('http');
// var server = http.Server(app);
// var io = require('socket.io').listen(server);
// var bodyParser = require("body-parser");

var express = require('express')
  , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + "/public"));

// web port
var PORT = process.env.PORT || 8000; 


// app.use(bodyParser.json());  // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.broadcast.emit('chat', {msg:"someone connected"});
    socket.emit('news', 'hello world');
    socket.on('chat', function (data) {
        console.log(data.msg);
        console.log("Do some comands here...?");
        socket.broadcast.emit('chat', data);
    });
    socket.on('disconnect', function () {
        console.log("someone disconnected");
        io.emit('chat',{msg:"someone disconnected"});
    });
});

server.listen(PORT, function () {
    var port = server.address().port;
    console.log("App now running on port ", port);
});
