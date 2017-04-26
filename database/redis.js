// 不一样的创建方式，多台获取，出来就是集群
var Redis = require('ioredis');
var cluster = new Redis.Cluster([
    { port: 8001,host: '192.168.110.19'},
    { port: 8001,host: '192.168.110.18'},
    { port: 8003,host: '192.168.110.19'}
],{
    redisOptions: {
        password: 'inteRedis'
    }
});

// 设置数据相同cluster.set('foo', 'bar');
// 获取数据相同cluster.get('foo', function (err, res) {    console.log(res);  });

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

cluster.on("error", function (err) {
    console.log("Error " + err);
});

function getKey(key,opts){
    return cluster.get(key,function(error,res){
        console.log(res);
        opts.msg = res;
        opts.callback(opts);
    });
}

function setKey(key,val){
    cluster.set(key,val);
}

/*
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();



 var redis = require("redis"),
 client = redis.createClient({
 host:'192.168.110.18',
 port:'8001',
 passowrd: 'inteRedis'
 });
});*/

exports.set = setKey;
exports.get = getKey;
