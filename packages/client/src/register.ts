import type { PostRegistrationDto, RegistrationDto } from "shared/dtos.mjs";

const headers = {
  'Content-Type': 'application/json',
};

/**
 * Send the attestation response to the server to verify the registration.
 * The server will store the public key credential for future authentication.
 * Therefore when we say verify, the verification is done by the server.
 * It's verifying that the public key credential is valid by checking
 * the challenge and attestation object.
 */
const postPublicKeyVerification = async (
  username: string,
  {
    attestationObject,
    clientDataJSON,
  }: AuthenticatorAttestationResponse,
) =>
  await fetch('/api/webauthn/register/verify', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username,
      attestationObject: btoa(String.fromCharCode(...new Uint8Array(attestationObject))),
      clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(clientDataJSON)))
    })
  });

/**
 * Start the registration process by sending a username to the server.
 * The server will respond with a challenge that the client will use to
 * create a public key credential.
 * The public key credential will be used to verify the registration.
 */
const postRegistration = async (body: PostRegistrationDto): Promise<RegistrationDto> =>
  await fetch('/api/webauthn/register', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  }).then((response) => response.json());

/**
 * Create a public key credential using the challenge provided by the server.
 * This will prompt the user to register a new credential on a device.
 * Commonly this will be a security key stored in google password manager
 * or on your mobile device.
 */
const createPublicKeyCredential = async (challengeDto: RegistrationDto) => {
  const decodedChallenge = atob(challengeDto.challenge);

  const publicKeyCredential = (await navigator.credentials.create({
    publicKey: {
      ...challengeDto,
      challenge: Uint8Array.from(decodedChallenge, c => c.charCodeAt(0)),
      user: {
        ...challengeDto.user,
        id: Uint8Array.from(challengeDto.user.id, c => c.charCodeAt(0))
      }
    }
  }) as PublicKeyCredential | null);

  const attestedCredential =
    publicKeyCredential?.response as AuthenticatorAttestationResponse | undefined;

  if (!attestedCredential) {
    throw new Error('Public key generation failed');
  }

  return attestedCredential
};

document.getElementById('register-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = (document.getElementById('username') as HTMLInputElement).value;
  const challengeDto = await postRegistration({ username });
  const publicKeyCredential = await createPublicKeyCredential(challengeDto);

  // Send the attestation response to the server to verify the registration.
  postPublicKeyVerification(username, publicKeyCredential);
});