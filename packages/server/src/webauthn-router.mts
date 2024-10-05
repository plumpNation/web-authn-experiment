import express, { Request, Response, NextFunction } from 'express';
import CBOR from 'cbor';
import { v4 as uuidV4 } from 'uuid';
import base64url from 'shared/base64url.ts';

export const webauthnRouter = express.Router();

webauthnRouter.post('/register', (req, res) => {
  const credentialDTO = req.body.credential;
  const attestationDTO = req.body.attestation;

  const utf8Decoder = new TextDecoder('utf-8');
  const credential = utf8Decoder.decode(credentialDTO);

  // verify the credential challenge
  const { challenge } = JSON.parse(credential);

  const attestation = CBOR.decode(attestationDTO);

  const { authData } = attestation;

  const dataView = new DataView(new ArrayBuffer(2));

  const idLenBytes = authData.slice(53, 55);

  idLenBytes.forEach((value, index) => dataView.setUint8(index, value));

  const credentialIdLength = dataView.getUint16();

  // get the credential ID
  const credentialId = authData.slice(55, 55 + credentialIdLength);

  // get the public key object
  const publicKeyBytes = authData.slice(55 + credentialIdLength);

  // the publicKeyBytes are encoded again as CBOR
  const publicKey = CBOR.decode(publicKeyBytes.buffer);

  // store the publicKeyBytes and credentialId in a database

  res.json({ status: 'ok' });
});

webauthnRouter.post('/challenge', (_, res) => {
  const randomStringFromServer = Math.random().toString(36).substring(2, 15);
  const challenge = Uint8Array.from(randomStringFromServer, c => c.charCodeAt(0));

  res.json({ challenge });
});

const createChallengeFrom = (store) => (req: Request, res: Response, next: NextFunction) => {
    const user = {
      id: uuidV4({}, Buffer.alloc(16)),
      name: req.body.email,
    }

    store.challenge(req, {user: user}, (err, challenge) => {
        if (err) return next(err)

        user.id = base64url.encode(user.id)

        res.json({
            user: user,
            challenge: base64url.encode(challenge),
        })
    })
};