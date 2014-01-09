/**
 * Created by Mortoni on 19/11/13.
 */
var readline = require('readline');
var rl;
var init = require('./config.js');
var config = init.Config;

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app, {log: false})
    , fs = require('fs');

var portNo = 7788;

app.listen(portNo);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('dataIn', function (data) {
        console.log(data);
        viz.sendCommand(data.my);
    });
});

var viz = init.Viz;
viz.open();

console.log('Opening command line...');

rl = readline.createInterface(process.stdin, process.stdout, null);
rl.setPrompt('> ');
/*
rl.question('Which Viz?', function(answer) {
    me.name = answer;
    console.log('Hello', me.name);
})

   */
console.log('\nBrowse to port ' + portNo);
console.log('\nWaiting for commands...("quit" to exit)');

rl.on('line', function(cmd) {

    if (cmd === 'quit') {
        rl.question('Are you sure? (y/n) ', function(answer) {
            if (answer === 'y') {
                viz.close();
                rl.close();
            } else {
                rl.prompt();
            }
        });
    } else {
        // parse the command
        //
        if (cmd === "v") {
            viz.version(false);
        } else if (cmd === "r") {
            viz.replySwap();
        } else if (cmd === "q") {
            viz.quietSwap();
        } else if (cmd === "d") {
            viz.destroy();
        } else if (cmd === "e") {
            viz.end();
        } else {
            viz.sendCommand(cmd);
        }
        //    console.log('You typed:', cmd);
        //    console.log('Type "quit" to exit');
        rl.prompt();
    }

});

rl.on('close', function() {
    console.log('Bye');
    process.exit();
});

rl.prompt();