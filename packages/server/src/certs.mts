/**
 * https servers require a key and certificate to run.
 * PEM (privacy enhanced mail) files are used to store the key and certificate.
 */
import fs from 'fs';

const certDir = '../certs';
const keyPath = `${certDir}/key.pem`;
const certPath = `${certDir}/cert.pem`;

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('key.pem and cert.pem files are required to run the server.');
  process.exit(1);
}

export const key = fs.readFileSync(keyPath);
export const cert = fs.readFileSync(certPath);