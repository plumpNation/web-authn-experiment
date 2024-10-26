const host = 'http://localhost:3000';
const registerUrl = `${host}/api/webauthn/register`;

document.getElementById('register-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;

    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    });

    const challengeDto = await response.json();

    const publicKeyCredential = await navigator.credentials.create({
      publicKey: {
        ...challengeDto,
        challenge: Uint8Array.from(atob(challengeDto.challenge), c => c.charCodeAt(0)),
        user: {
          ...challengeDto.user,
          id: Uint8Array.from(atob(challengeDto.user.id), c => c.charCodeAt(0))
        }
      }
    });

    const attestationObject = publicKeyCredential?.response.attestationObject;
    const clientDataJSON = publicKeyCredential?.response.clientDataJSON;

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
  });