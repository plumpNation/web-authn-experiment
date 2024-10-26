const host = 'http://localhost:3000';
const loginUrl = `${host}/api/webauthn/authenticate`;

document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    });

    const challengeDto = await response.json();

    const publicKeyCredential = await navigator.credentials.get({
      publicKey: {
        ...challengeDto,
        challenge: Uint8Array.from(atob(challengeDto.challenge), c => c.charCodeAt(0)),
        allowCredentials: challengeDto.allowCredentials.map((cred) => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
        }))
      }
    });

    const authenticatorData = publicKeyCredential?.response.authenticatorData;
    const clientDataJSON = publicKeyCredential?.response.clientDataJSON;
    const signature = publicKeyCredential?.response.signature;

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