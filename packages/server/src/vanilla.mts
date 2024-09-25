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

app.get('/webauthn/challenge', (_, res) => {
  const randomStringFromServer = Math.random().toString(36).substring(2, 15);
  const challenge = Uint8Array.from(randomStringFromServer, c => c.charCodeAt(0));

  res.json({ challenge });
});

server.listen(3000, () => { console.log('listening on 3000') });