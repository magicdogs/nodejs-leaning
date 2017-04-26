var express = require('express');
var router = express.Router();


var mysql = require('../database/mysql');
var mongo = require('../database/mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    mysql.query(res,function(res,data,cols){
        mongo.insert("chihuo","appointment",data);
        res.render('userex', { title: 'mysql-view',data:data,cols:cols });
    });
});

/* GET home page. */
router.get('/v', function(req, res, next) {
    res.header('X-USER-TOKEN','aaa');
    res.json({name:'admin',sex:1});
});




module.exports = router;
