var config = require('./config.js');

var express = require('express')
  , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

var PORT = process.env.PORT || config.port;

server.listen(PORT, function(){
  console.log('listening on *:', PORT);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('chat', function(msg){
    io.emit('chat', msg);
  });
  socket.on('disconnect', function () {
    io.emit('chat',"someone disconnected");
  });
});
