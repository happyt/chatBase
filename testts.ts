/**
 * Created by Mortoni on 19/11/13.
 */
/*!
 * configuration data
 */

var net = require('net');

var Config =  {

    // target viz configuration
    engine: {
        viz: '172.20.222.58',
        vport: 6100,
        trio: '172.20.69.17',
        tport: 6200
    },

    // chat socket configuration
    chatserver: {
        ip: '172.20.69.17',
        port: 7777
    }
}

var Viz = {

    ip: '172.20.222.58',
    port: 6100,
    replies: true,
    quiet: false,
    live: true,
    counter: 0,
    socket: 0,

    open: function() {
        dlog('Opening a port to Viz...' + this.ip + ", " + this.port);

        var _this = this;

        this.socket = net.connect({host: this.ip, port: this.port},
            function() { //'connect' listener
                _this.live = true;
                dlog('client open');
            });

        this.socket.on('data', function(data) {
            dlog(data.toString());
        });

        this.socket.on('end', function() {
            this.live = false;
            dlog('client ended');
        });

        this.socket.on('close', function() {
            this.live = false;
            dlog('client closed');
        });

        this.socket.on('timeout', function() {
            dlog('client timed out');
        });

        this.socket.on('error', function() {
            dlog('client error');
        });

        this.socket.on('connect', function() {
            dlog('client connected');
        });

    },

    version: function() {
        this.sendCommand("MAIN VERSION");
    },

    replySwap: function() {
        this.replies = !this.replies;
    },

    quietSwap: function() {
        this.quiet = !this.quiet;
    },

    sendCommand: function(cmd) {

        //   dlog('Live?: ' + this.live);

        if (!this.live) {
            dlog('Re-opening a port to Viz...' + this.ip + ", " + this.port);
            this.open();
        }

        if (this.replies  && !this.quiet) {
            this.counter++;
            this.socket.write(this.counter + " " + cmd + "\0");
        } else {
            if (this.quiet) {
                this.socket.write("@ " + cmd + "\0");
            } else  {
                this.socket.write("-1 " + cmd + "\0");
            }
        }
    },

    end: function() {
        this.live = false;
        this.socket.end();
    },

    destroy: function() {
        this.live = false;
        this.socket.destroy();
    }
}

module.exports.Config = Config;
module.exports.Viz = Viz;

function dlog(data) {
    console.log(">>> " + data);
}