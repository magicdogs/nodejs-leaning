var express = require('express');
var router = express.Router();

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require("fs");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();



var cheerio = require('cheerio');
var superagent = require('superagent');

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 3001 });
wss.on('connection', function (ws) {

  console.log('client connected',ws);
  ws.send("hello");

  ws.on('message', function (message) {

    console.log(message);

  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  superagent.get('https://cnodejs.org/')
      .end(function (err, sres) {
        if (err) {
          return next(err);
        }
        var $ = cheerio.load(sres.text);
        var items = [];
        $('#topic_list .topic_title').each(function (idx, element) {
          var $element = $(element);
          items.push({
            title: $element.attr('title'),
            href: $element.attr('href')
          });
        });
        res.send(items);
      });
});


/* GET users listing. */
router.get('/ext', function(req, res, next) {
  console.log(req.param);
  var v = req.query["t"];
  console.log(v);
  res.send('respond with a resource ext');
});

/* POST users listing. */
router.post('/ext',multipartMiddleware, function(req, res, next) {
  console.log(req.files);
  console.log(req.file);
  var v = req.query["t"];
  console.log(v);
  res.send('respond with a resource ext');
});


module.exports = router;
