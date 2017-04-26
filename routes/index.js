var express = require('express');
var Eventproxy = require('eventproxy');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var router = express.Router();

var Cat = mongoose.model('Cat', {
  name: String,
  friends: [String],
  age: Number,
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/s', function(req, res, next) {

  // new 一个新对象，名叫 kitty
// 接着为 kitty 的属性们赋值
  var kitty = new Cat({ name: 'Zildjian', friends: ['tom', 'jerry']});
  kitty.age = 3;

// 调用 .save 方法后，mongoose 会去你的 mongodb 中的 test 数据库里，存入一条记录。
  kitty.save(function (err) {
    if (err) // ...
      console.log('meow');
  });

  Cat.find({},function(err,data){

  });
  Cat.aggregate([
      {$project: {_id : 0 ,name: 1, age: 1}}, {$limit : 2},{$limit :　1}],function(error,data){
    res.render('index', { title: JSON.stringify(data) });
  });
  var ep = Eventproxy.create('data',function(data){
    //console.log(data);
    //res.render('index', { title: __filename });
  });

  ep.fail(function(error){
    console.log(error);
  });

  fs.readFile('app.js', 'utf-8',function (err, data) {
    if (err) {
      return console.error(err);
    }
    ep.emit('data',data);
  });

});

module.exports = router;
