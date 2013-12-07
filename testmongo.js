/**
 * Created by Mortoni on 07/12/13.
 */

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://hemdatiod340:27017/logger', function(err, db) {
    if(err) throw err;

    var collection = db.collection('messages');
    collection.insert({type:"abc", message:"ianm2"}, function(err, docs) {

        collection.count(function(err, count) {
            console.log(format("count = %s", count));
        });

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            console.dir(results);
            // Let's close the db
            db.close();
        });
    });
})