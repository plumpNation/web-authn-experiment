import { type Request, type Response } from 'express';
import crypto from 'crypto';

// Temporary storage for challenges and user data
const challenges: { [key: string]: string } = {};
const users: { [key: string]: any } = {};

// Helper function to generate a random challenge
const generateChallenge = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Registration endpoint
export const startRegistration = (req: Request, res: Response) => {
  console.log("startRegistration");

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
    pubKeyCredParams: [{ type: "public-key", alg: -7 }]
  });
};

// Registration verification endpoint
export const verifyRegistration = (req: Request, res: Response) => {
  const { username, attestationObject, clientDataJSON } = req.body;
  const challenge = challenges[username];

  // Verify the challenge and attestation here (simplified)
  if (challenge && attestationObject && clientDataJSON) {
    users[username] = { attestationObject, clientDataJSON };
    delete challenges[username];
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid registration' });
  }
};

// Authentication endpoint
export const startAuthentication = (req: Request, res: Response) => {
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

// Authentication verification endpoint
export const verifyAuthentication = (req: Request, res: Response) => {
  const { username, authenticatorData, clientDataJSON, signature } = req.body;
  const challenge = challenges[username];

  // Verify the challenge and signature here (simplified)
  if (challenge && authenticatorData && clientDataJSON && signature) {
    delete challenges[username];
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid authentication' });
  }
};