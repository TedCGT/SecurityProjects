const mysql = require('mysql2');
const config = require('../Config/ServerConfig.env.json');

var pool = mysql.createPool({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password,
    database: config.Database.Database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Dupe checks.
async function checkDuplicateAgent(agentIP, agentMAC){
    //Check if agent exists. Need to actually add the check.
    var sql = "SELECT * FROM malagents.agents WHERE agentIP = '" + agentIP + "' OR agentMAC = '" + agentMAC + "'";
    try{
        const conn = await pool.promise().getConnection();
        const [results] = await conn.query(sql);
        console.log(results);
        conn.release();
    } catch (err) {
        console.error('Error:', err);
    }
}

//Baseline functions.
async function readActiveConnections() {
    try {
        const conn = await pool.promise().getConnection();
        const [results] = await conn.query('SELECT * FROM malagents.agents WHERE agentStatus = 1');
        console.log(results);
        conn.release();
    } catch (err) {
        console.error('Error:', err);
    }
}

async function establishNewAgent(agentIP, agentMAC) {
    try {
        const conn = await pool.promise().getConnection();
        await checkDuplicateAgent(agentIP, agentMAC);
        const sql = "INSERT INTO malagents.agents (agentIP, agentStatus, agentMAC) VALUES (?, 1, ?)";
        const [results] = await conn.query(sql, [agentIP, agentMAC]);
        console.log('New agent added:', results);
        conn.release();
    } catch (err) {
        console.error('Error:', err);
    } 
}


module.exports= {
    readActiveConnections,
    establishNewAgent
};