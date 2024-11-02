import type { AuthenticationDto } from "shared/dtos.mjs";

const headers = {
  'Content-Type': 'application/json',
};

const postLogin = async (username: string): Promise<AuthenticationDto> =>
  await fetch('/api/webauthn/authenticate', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username })
  })
  .then((response) => response.json());

const getPublicKey = async (challengeDto: AuthenticationDto) => {
  const credentialConfig: CredentialRequestOptions = {
    publicKey: {
      ...challengeDto,
      challenge: Uint8Array.from(atob(challengeDto.challenge), c => c.charCodeAt(0)),
      allowCredentials: challengeDto.allowCredentials.map((cred: any) => ({
        ...cred,
        id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
      }))
    }
  };

  const publicKeyCredential = (await navigator.credentials.get(credentialConfig) as PublicKeyCredential | null);

  return publicKeyCredential?.response as AuthenticatorAssertionResponse;
};

document.getElementById('login-form')?.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const challengeDto = await postLogin(username);
    const publicKey = await getPublicKey(challengeDto);

    if (!publicKey) {
      throw new Error('Public key generation failed');
    }

    const {
      authenticatorData,
      clientDataJSON,
      signature,
    } = publicKey;

    const body = {
      username,
      authenticatorData: btoa(String.fromCharCode(...new Uint8Array(authenticatorData))),
      clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(clientDataJSON))),
      signature: btoa(String.fromCharCode(...new Uint8Array(signature)))
    }

    await fetch('/api/webauthn/authenticate/verify', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  });