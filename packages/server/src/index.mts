import express from 'express';
import https from 'https';
import multer from 'multer';

import { webauthnRouter } from './webauthn-router.mts';
import { key, cert } from './certs.mts';

const app = express();
const server = https.createServer({ key, cert }, app);

// Since we’re working with multipart form data (for now)
// and since we’re not uploading files, only text fields,
// we can use the none() method
app.use(multer().none());

// When the extended option is set to false, express will use the
// querystring library to parse the url-encoded data
app.use(express.urlencoded({ extended: false }));

app.get('/api', (_, res) => {
  res.send('Hello World');
});

app.use('/api/webauthn', webauthnRouter);

server.listen(3000, () => { console.log('listening on 3000') });