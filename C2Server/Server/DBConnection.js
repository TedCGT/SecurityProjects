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

//Inserts new agent connection into the malagents DB. If it catches a duplicate entry, it will catch the error and return false.
async function establishNewAgent(agentIP, agentMAC) {
    try {
        const conn = await pool.promise().getConnection();
        const sql = "INSERT INTO malagents.agents (agentIP, agentStatus, agentMAC) VALUES (?, 1, ?)";
        const [results] = await conn.query(sql, [agentIP, agentMAC]);
        console.log('New agent added:', results);
        conn.release();
        return true;
    } catch (err) {
        if(err.code == 'ER_DUP_ENTRY'){
            return false;
        }
    } 
}


module.exports= {
    readActiveConnections,
    establishNewAgent
};