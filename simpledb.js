/**
 * Created by Mortoni on 07/12/13.
 */
var db = require("./dblogger");

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

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


db.messages.save({type: "random", date: getDateTime(), command: "iLoveMongo"}, function(err, saved) {
    if( err || !saved ) console.log("Message not saved");
    else console.log("Message saved");
});

db.messages.find({type: "random"}, function(err, mess) {
    if( err || !mess) console.log("No messages found");
    else mess.forEach( function(msg) {
        console.log(msg);
    } );
});

db.messages.update({type: "random"}, {$set: {command: "iReallyLoveMongo"}}, function(err, updated) {
    if( err || !updated ) console.log("Not updated");
    else console.log("Updated");

});

