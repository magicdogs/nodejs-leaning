var express = require('express');
var router = express.Router();

var redis = require('../database/redis')

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    redis.set("aaa",new Date());
    redis.get("aaa",{resp:res,callback:function(data){
        data.resp.send(data.msg);
    }});
});

module.exports = router;
