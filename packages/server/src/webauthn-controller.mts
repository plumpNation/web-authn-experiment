import { type Request, type Response } from 'express';

import type {
  PostRegistrationDto,
  PostAuthenticationDto,
  PostVerifyRegistrationDto,
  PostVerifyAuthenticationDto,
  PublicKeyRegistrationDto,
} from 'shared/dtos.mts';

import { Attestation } from './Attestation.mts';
import { createPublicKeyRegistrationDto, generateChallenge } from './webauth.helpers.mts';

// Temporary storage for challenges and user data
// todo replace with a real database
const challenges: { [key: string]: string } = {};
const users: { [key: string]: {
  clientDataJSON: string,
  attestationObject: string,
} } = {};

const expectedRPID = 'Example Corp';
const expectedOrigin = 'localhost';

export const startRegistration = (
  req: Request<{}, null, PostRegistrationDto>,
  res: Response<PublicKeyRegistrationDto>,
) => {
  const { username } = req.body;
  const challenge = generateChallenge();

  // The challenge for a user is overwritten, meaning
  // only one challenge can be active at a time.
  challenges[username] = challenge;

  res.json(createPublicKeyRegistrationDto(username, challenge, expectedRPID));
};

export const verifyRegistration = async (
  req: Request<{}, null, PostVerifyRegistrationDto>,
  res: Response<{ ok: boolean, error?: string }>,
) => {
  const { username } = req.body;
  const expectedChallenge = challenges[username];

  if (!expectedChallenge) {
    throw new Error('No challenge found for user');
  }

  const attestation = new Attestation(
    req.body,
    {
      fmt: 'packed',
      rpid: expectedRPID,
      origin: expectedOrigin,
      challenge: expectedChallenge,
    },
  );

  if (!attestation.isVerified()) {
      throw new Error("Signature verification failed.");
  }

  delete challenges[username];

  res.json({ ok: true });
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