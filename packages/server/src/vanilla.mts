import express from 'express';
import https from 'https';
import fs from 'fs';

const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

const app = express();

const server = https.createServer({key: key, cert: cert }, app);

app.get('/', (_, res) => {
  res.send('Hello World');
});

server.listen(3000, () => { console.log('listening on 3000') });