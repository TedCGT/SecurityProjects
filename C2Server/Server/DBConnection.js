const mysql = require('mysql');
const config = require('../Config/ServerConfig.env.json');

var conn = mysql.createConnection({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password
});


function readActiveConnections(){
    conn.connect(function(err){
        if(err) throw err;
        var sql = "SELECT * FROM malagents.agents WHERE agentStatus = 1";
        conn.query(sql, function(err, results){
            if (err) throw err;
            console.log(results);
            conn.end();
        });
    });
}

module.exports= {
    readActiveConnections
};