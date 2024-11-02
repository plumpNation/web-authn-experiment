import { type Request, type Response } from 'express';
import crypto from 'crypto';

import type {
  RegistrationDto,
  PostRegistrationDto,
  PostAuthenticationDto,
  PostVerifyRegistrationDto,
  PostVerifyAuthenticationDto,
  UserDto,
} from 'shared/dtos.mts';

// Temporary storage for challenges and user data
// todo replace with a real database
const challenges: { [key: string]: string } = {};
const users: { [key: string]: {
  clientDataJSON: string,
  attestationObject: string,
} } = {};

const generateChallenge = () => crypto.randomBytes(32).toString('base64');

export const startRegistration = (
  req: Request<{}, null, PostRegistrationDto>,
  res: Response<RegistrationDto>,
) => {
  const { username } = req.body;
  const challenge = generateChallenge();

  challenges[username] = challenge;

  res.json({
    challenge,
    rp: { name: "Example Corp" },
    user: {
      id: Buffer.from(username).toString('base64'),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [{
      type: "public-key",
      alg: -7,
    }],
  });
};

export const verifyRegistration = (
  req: Request<{}, null, PostVerifyRegistrationDto>,
  res: Response<{ ok: boolean, error?: string }>,
) => {
  const { username, attestationObject, clientDataJSON } = req.body;
  const challenge = challenges[username];

  // Verify the challenge and attestation here (simplified)
  if (challenge && attestationObject && clientDataJSON) {
    users[username] = { attestationObject, clientDataJSON };

    delete challenges[username];

    res.json({ ok: true });

    return;
  }

  res.status(400).json({
    ok: false,
    error: 'Invalid registration',
  });
};

export const startAuthentication = (
  req: Request<{}, null, PostAuthenticationDto>,
  res: Response,
) => {
  const { username } = req.body;
  const challenge = generateChallenge();
  challenges[username] = challenge;

  res.json({
    challenge,
    allowCredentials: [{
      type: "public-key",
      id: Buffer.from(username).toString('base64')
    }]
  });
};

export const verifyAuthentication = (
  req: Request<{}, null, PostVerifyAuthenticationDto>,
  res: Response<{ ok: boolean, error?: string }>,
) => {
  const { username, authenticatorData, clientDataJSON, signature } = req.body;
  const challenge = challenges[username];

  // Verify the challenge and signature here (simplified)
  if (challenge && authenticatorData && clientDataJSON && signature) {
    delete challenges[username];

    res.json({ ok: true });

    return;
  }

  res.status(400).json({
    ok: false,
    error: 'Invalid authentication',
  });
};