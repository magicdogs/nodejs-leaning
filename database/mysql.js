//连接数据库
var mysql = {};
mysql.lib = require('mysql');
mysql.pool = mysql.lib.createPool({
    connectionLimit : 10,
    host: '192.168.101.24',
    user: 'devapp',
    password: 'maMaepJZ8uQf',
    database:'marketing',
    port:'3306'
});

mysql.query = function(res,callback){
    mysql.pool.query('SELECT * FROM `t_appointment`', function (error, results, fields) {
        if (error) throw error;
        callback(res,results,fields);
    });
}

mysql.prototype = {
    show : function(arg){
        console.log(arg);
    }
}


module.exports = mysql;

/*

 var connection = mysql.createConnection({
 host: '192.168.101.24',
 user: 'devapp',
 password: 'maMaepJZ8uQf',
 database:'marketing',
 port:'3306'
 });

*    connection.connect();
 //查询
 connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
 if (err) throw err;
 console.log('The solution is: ', rows[0].solution);
 });
 //关闭连接
 connection.end();
* */