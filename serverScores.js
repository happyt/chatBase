var config = require('./config.js');
var request = require('request');
var xml2json = require("node-xml2json");

var feedsCount = config.feeds.length;
var feedNo = feedsCount;    // so starts with first feed

var express = require('express'),
       http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var tick = 0;
var maxTime = config.timecount;


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

var myVar = setInterval(function(){ myTimer() },  config.polltime * 1000);

function myTimer() {
    tick++;
    feedNo++;
    if (feedNo >= feedsCount) feedNo = 0;
    feed = config.feeds[feedNo];
    if (tick == maxTime) {
        console.log(getDateTime());
        tick = 0;
    } else {
        process.stdout.write('.');
        process.stdout.write(feed.title);
    }
    request({
        url: feed.url, //URL to hit
        qs: {from: 'feed example', time: +new Date()}, //Query string data
        method: 'GET', //Specify the method
        headers: { //We can define headers too
            'Content-Type': 'MyContentType',
            'Custom-Header': 'Custom Value'
        }
    }, function(error, response, body){
        // console.log("...returned", error);
        if(error) {
            console.log("Feed err: ", error);
        } else {
            if (response.statusCode !== 200) {
                console.log("Status code: ", response.statusCode);
            } else {
       //         if (!quiet) console.log(body);
               var timeString = getDateTime().substring(11);
               var output = {};
               output.tick = tick;
               output.time = timeString;
               output.title = feed.title;

                jsonObj = {};
                var matches = [];
            // get the data
                switch(feed.title) {
                case "mst":
                    output.message = "test mst";  
                    jsonObj = xml2json.parser( body );
               //        console.log(jsonObj.event.round[0]);
                    var rnd = 0;
                    var mNo = 0;
                    for (var i = 0, len = jsonObj.event.round.length; i < len; i++) {
                        rnd = jsonObj.event.round[i].no;
                        for (var j = 0, jlen = jsonObj.event.round[i].matches.match.length; j < jlen; j++) {
                            mNo = jsonObj.event.round[i].matches.match[j].no;
                            match = jsonObj.event.round[i].matches.match[j];
                            var m = {
                                holesPlayed : 0,
                                score: 0,
                                result: "-"
                            }
                            m.round = rnd;
                            m.match = mNo;
                            m.holesPlayed = match.holesplayed;
                            if (!isEmpty(match.usa_val)) {
                                m.score = match.usa_val;
                            } else {
                                m.score = 0;                                
                            }

                            if (!isEmpty(match.usa)) {
                                m.result = match.usa;
                            } else {
                                m.result = 0;
                            }
                            matches.push(m);
     //                          console.log("add - ", matches.length, m.round);
                        }
                    }
                    break;
                case "ssn":
                    output.message = "test ssn";  
                    jsonObj = JSON.parse(body);
           //         console.log(jsonObj.tournament.feedId);

                    for (var i = 0, len = jsonObj.matchPlaySessions.length; i < len; i++) {
                        var mps = jsonObj.matchPlaySessions[i];
                        for (var j = 0, mlen = mps.matchPlayMatches.length; j < mlen; j++) {
                            var m = {};
                            match =   mps.matchPlayMatches[j];
                            m.round = 1;
                            m.match = 1;
                            m.holesPlayed = match.holesPlayed;
                            m.score = match.score;
                            m.result = "?" + match.result;
                            matches.push(m);
                               console.log(m);
                        }
                    }
                    break;
                case "leeds":
                    output.message = "test leeds";      
                    jsonObj = JSON.parse(body);
           //         console.log(jsonObj.tournament.feedId);

                    for (var i = 0, len = jsonObj.tournament.matches.length; i < len; i++) {
                        var match = jsonObj.tournament.matches[i];
                         
                       
                            var m = {
                                holesPlayed : 0,
                                score: 0,
                                result: "-"
                            }
console.log(match.score);
                            m.holesPlayed = match.holesPlayed;
                            if (match.score) {
                                m.score = match.score;
                            } else {
                                m.score = 0;                                
                            }

                            if (match.result) {
                                m.result = match.result;
                            } else {
                                m.result = 0;
                            }

                            matches.push(m);
                               console.log(matches.length, m.round);
                    }

                    break;
                default:
                    output.message = "unknown feed";  
                }                    
                output.matches = matches;
                io.emit('chat', output);
            }
        }
    });
};

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return day + "-" + month + "-" + year + " " + hour + ":" + min + ":" + sec;
}
