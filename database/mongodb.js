var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var DB_CONN_STR = 'mongodb://localhost:27017/';
//mongodb://server-1:27017,server-2:27017,server-3:27017/mydb?replicaSet=myReplSet

var mongo = {};

mongo.insert = function (database, collection, jsonData) {
    MongoClient.connect(DB_CONN_STR + database, function (err, db) {
        var colls = db.collection(collection);
        colls.insert(jsonData);
        db.close();
    });
};


mongo.query = function (database, collection, jsonQuery, res, callback) {
    MongoClient.connect(DB_CONN_STR + database, function (err, db) {
        var colle = db.collection(collection);
        colle.find(jsonQuery).toArray(function (err, items) {
            if (err == null) {
                callback(res, items);
                db.close();
                return;
            }
            db.close();
            console.log(err);
        });

    });
};
;
mongo.remove = function (database, collection, condition) {
    MongoClient.connect(DB_CONN_STR + database, function (err, db) {
        var colle = db.collection(collection);
        colle.remove(condition);
        db.close();
    });
};
mongo.aggregatex = function (p, collection) {

        MongoClient.connect(DB_CONN_STR + p,function(err,db){
                var docs = [{
                    title: "this is my title", author: "bob", posted: new Date(),
                    pageViews: 5, tags: ["fun", "good", "fun"], other: {foo: 5},
                    comments: [
                        {author: "joe", text: "this is cool"}, {author: "sam", text: "this is bad"}
                    ]
                }];
                var collectionx = db.collection(collection);
                collectionx.insertMany(docs, {w: 1},function(err,ret){
                    collectionx.aggregate([
                        {
                            $project: {
                                author: 1,
                                tags: 1
                            }
                        },
                        {$unwind: "$tags"},
                        {
                            $group: {
                                _id: {tags: "$tags"},
                                authors: {$addToSet: "$author"}
                            }
                        }
                    ], function (err, result) {
                        console.log('good', result[0]._id.tags);
                        console.log(['bob'], result[0].authors);
                        console.log('fun', result[1]._id.tags);
                        console.log(['bob'], result[1].authors);
                        db.close();
                    });
                }) ;
            });
};


module.exports = mongo;


/*var deferred = Q.defer();
 if(!err){
 deferred.resolve(db);
 }else{
 deferred.reject(err);
 }
 return deferred.promise;*/


/**
 var collectionx = db.collection("appointment");
 // Insert the docs
 var p = collectionx.insertMany(docs, {w: 1}) ;
 p.then(function(data){
            console.log(data);
            collectionx.aggregate([
                {
                    $project: {
                        author: 1,
                        tags: 1
                    }
                },
                {$unwind: "$tags"},
                {
                    $group: {
                        _id: {tags: "$tags"},
                        authors: {$addToSet: "$author"}
                    }
                }
            ], function (err, result) {
                console.log(err);
                console.log('good', result[0]._id.tags);
                console.log(['bob'], result[0].authors);
                console.log('fun', result[1]._id.tags);
                console.log(['bob'], result[1].authors);
                db.close();
            });
        },function(err){
            console.log(err);
        });

 */


/*
* mongo.aggregatex = function (p, collection) {
 MongoClient.connect(DB_CONN_STR + p,(function(collName){
 return function(err,db){
 var docs = [{
 title: "this is my title", author: "bob", posted: new Date(),
 pageViews: 5, tags: ["fun", "good", "fun"], other: {foo: 5},
 comments: [
 {author: "joe", text: "this is cool"}, {author: "sam", text: "this is bad"}
 ]
 }];
 var collectionx = db.collection(collName);
 collectionx.insertMany(docs, {w: 1},function(err,ret){

 collectionx.aggregate([
 {
 $project: {
 author: 1,
 tags: 1
 }
 },
 {$unwind: "$tags"},
 {
 $group: {
 _id: {tags: "$tags"},
 authors: {$addToSet: "$author"}
 }
 }
 ], function (err, result) {
 console.log(err);
 console.log('good', result[0]._id.tags);
 console.log(['bob'], result[0].authors);
 console.log('fun', result[1]._id.tags);
 console.log(['bob'], result[1].authors);
 db.close();
 });
 }) ;

 }
 })(collection));
 };
* */