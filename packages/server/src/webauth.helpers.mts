import crypto from 'crypto';
import { PublicKeyRegistrationDto } from "shared/dtos.mjs";

// https://buildkite.com/resources/blog/goodbye-integers-hello-uuids/
// https://uuid7.com/
import { v7 as uuid7 } from 'uuid';

export const generateChallenge = () => crypto.randomBytes(32).toString('base64');

export const createPublicKeyRegistrationDto = (
    username: string,
    /**
     * A challenge that the (client) authenticator must sign to prove that it is
     * in possession of the private key. The server then verifies the signature
     * using the public key.
     *
     * Challenge rules:
     * - The server must generate a new cryptographically secure challenge
     *      for each registration.
     * - It should be at least 16 bytes long to prevent brute force attacks.
     * - The server must store the challenge for later verification.
     * - The server must ensure that the challenge is unique for each registration
     *      to prevent replay attacks.
     * - The challenge should be base64 encoded to make it easier to send
     *      over the network.
     */
    challenge: string,
    /**
     * The relying party identifier. This is the name of the service
     * that the user is registering with, e.g. "Example Corp" or
     * the domain name of the service.
     */
    rpid: string,
): PublicKeyRegistrationDto => ({
  challenge,
  rp: { name: rpid },
  user: {
    id: uuid7(),
    name: username,
    displayName: username,
  },
  pubKeyCredParams: [{
    type: 'public-key',
    alg: -7,
  }],
});