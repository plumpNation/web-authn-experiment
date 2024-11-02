import type { PostRegistrationDto, RegistrationDto } from "shared/dtos.mjs";

const headers = {
  'Content-Type': 'application/json',
};

const postVerification = async (
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

const postRegistration = async (body: PostRegistrationDto): Promise<RegistrationDto> =>
  await fetch('/api/webauthn/register', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  }).then((response) => response.json());

const createPublicKey = async (challengeDto: RegistrationDto) => {
  debugger;
  const decodedChallenge = atob(challengeDto.challenge);
  const decodedUserId = atob(challengeDto.user.id);

  const publicKeyCredential = (await navigator.credentials.create({
    publicKey: {
      ...challengeDto,
      challenge: Uint8Array.from(decodedChallenge, c => c.charCodeAt(0)),
      user: {
        ...challengeDto.user,
        id: Uint8Array.from(decodedUserId, c => c.charCodeAt(0))
      }
    }
  }) as PublicKeyCredential | null);

  const publicKey = publicKeyCredential?.response as AuthenticatorAttestationResponse | undefined;

  if (!publicKey) {
    throw new Error('Public key generation failed');
  }

  return publicKey
};

document.getElementById('register-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = (document.getElementById('username') as HTMLInputElement).value;
  const challengeDto = await postRegistration({ username });
  const publicKeyCredential = await createPublicKey(challengeDto);

  postVerification(username, publicKeyCredential);
});