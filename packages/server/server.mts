import https from 'https';
import fs from 'fs';
import { type IncomingMessage, type ServerResponse } from 'http';
import { Fido2Lib } from 'fido2-lib';

const f2l = new Fido2Lib({
  timeout: 42,
  rpId: "example.com",
  rpName: "ACME",
  rpIcon: "https://example.com/logo.png",
  challengeSize: 128,
  attestation: "none",
  cryptoParams: [-7, -257],
  authenticatorAttachment: "platform",
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: "required"
});

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