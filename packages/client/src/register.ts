import { RegistrationDto } from "shared/dtos";

const postVerification = async (
  username: string,
  {
    attestationObject,
    clientDataJSON,
  }: AuthenticatorAttestationResponse,
) =>
  await fetch('/api/webauthn/register/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      attestationObject: btoa(String.fromCharCode(...new Uint8Array(attestationObject))),
      clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(clientDataJSON)))
    })
  });

const postRegistration = async (username: string): Promise<RegistrationDto> =>
  await fetch('/api/webauthn/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username })
  }).then((response) => response.json());

const createCredential = async (challengeDto: RegistrationDto) => {
  const publicKeyCredential = (await navigator.credentials.create({
    publicKey: {
      ...challengeDto,
      challenge: Uint8Array.from(atob(challengeDto.challenge), c => c.charCodeAt(0)),
      user: {
        ...challengeDto.user,
        id: Uint8Array.from(atob(challengeDto.user.id), c => c.charCodeAt(0))
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
  const challengeDto = await postRegistration(username);

  const publicKeyCredential =

  postVerification(username, publicKey);
});