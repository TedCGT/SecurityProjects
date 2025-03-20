const mysql = require('mysql');
const config = require('./ServerConfig.env.json');

var conn = mysql.createConnection({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected...");
});

conn.end();