const path = require('path');
const config = require('../Config/ServerConfig.env.json');
const dbConn = require('./DBConnection.js');
const express = require('express');
const https = require('https');
const fs = require('fs');

const certPath = fs.readFileSync(path.resolve(__dirname, config.Keys.CertPath), 'utf8');
const privateKeyPath = fs.readFileSync(path.resolve(__dirname, config.Keys.PrivateKeyPath), 'utf8');


const options = {
    key: privateKeyPath,
    cert: certPath
};

const app = express();
app.use(express.json());


app.post('/establishAgent', (req, res) => {
    console.log("Body: ");
    console.log(req.body);
    console.log("Headers: ");
    console.log(req.headers);
    res.send("Hello World! Responses are working!");
});

https.createServer(options, app).listen(config.Server.Port, () => {
    console.log(`Server started on port ${config.Server.Port}`);
});

dbConn.readActiveConnections();