/**
 * https servers require a key and certificate to run.
 * PEM (privacy enhanced mail) files are used to store the key and certificate.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certDir = path.resolve(path.join(__dirname, '..', 'certs'));
const keyPath = `${certDir}/key.pem`;
const certPath = `${certDir}/cert.pem`;

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error(
    `key.pem and cert.pem files are required to run the server.
    Looked in ${certDir} directory for ${keyPath} and ${certPath} files.`
  );

  throw new Error('Missing key.pem and cert.pem files');

  process.exit(1);
}

export const key = fs.readFileSync(keyPath);
export const cert = fs.readFileSync(certPath);