/**
 * Created by Mortoni on 19/11/13.
 */
var config = require('./config.js');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var portNo = config.port;

var bodyParser = require("body-parser");

//=======================
// web server
//
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// web port
var PORT = process.env.PORT || portNo; 
//
//=======================
// Initialize the app.
//
    var server = app.listen(PORT, function () {
        console.log("App now running on port", PORT);
    });

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('dataIn', function (data) {
        console.log(data);
/*
Handle commands here...
*/
    });
});

