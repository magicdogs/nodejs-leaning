var express = require('express');
var router = express.Router();

var mongo = require('../database/mongodb')

/* GET home page. */
router.get('/', function(req, res, next) {
    mongo.query("chihuo","appointment",{},res,function(res,data){
        console.log(data);
        res.render('mongo-view',{title:'mongodb',data:data});
    });
    //mongo.remove("chihuo","users",{});
});


/* GET home page. */
router.get('/aggregate', function(req, res, next) {
    mongo.aggregatex("chihuo","appointment");
    res.send("ok");
    //mongo.aggregatex("chihuo","appointment");
    /*mongo.aggregate("chihuo","appointment",{},{resp:res,callback:function(data){
        console.log(data.msg);
        data.resp.render('mongo-view',{title:'mongodb',data:data.msg});
    }});*/
    //mongo.remove("chihuo","users",{});
});

module.exports = router;
