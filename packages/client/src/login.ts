import type { AuthenticationDto } from "shared/dtos";

const postLogin = async (username: string): Promise<AuthenticationDto> =>
  await fetch('/api/webauthn/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username })
  })
  .then((response) => response.json());

document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const challengeDto = await postLogin(username);

    const publicKeyCredential = (await navigator.credentials.get({
      publicKey: {
        ...challengeDto,
        challenge: Uint8Array.from(atob(challengeDto.challenge), c => c.charCodeAt(0)),
        allowCredentials: challengeDto.allowCredentials.map((cred: any) => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
        }))
      }
    }) as PublicKeyCredential | null);

    const publicKey = publicKeyCredential?.response as AuthenticatorAssertionResponse;

    if (!publicKey) {
      throw new Error('Public key generation failed');
    }

    const {
      authenticatorData,
      clientDataJSON,
      signature,
    } = publicKey;

    await fetch('/api/webauthn/authenticate/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        authenticatorData: btoa(String.fromCharCode(...new Uint8Array(authenticatorData))),
        clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(clientDataJSON))),
        signature: btoa(String.fromCharCode(...new Uint8Array(signature)))
      })
    });
  });