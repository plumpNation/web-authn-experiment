import https from 'https';
import fs from 'fs';
import { type IncomingMessage, type ServerResponse } from 'http';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  res.writeHead(200);
  res.end("hello world\n");
}

console.log("Server running at https://localhost:3000/");
https.createServer(options, app).listen(3000);