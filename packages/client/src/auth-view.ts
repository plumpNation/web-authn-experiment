import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChallengeDto } from 'shared/dtos';
import * as base64url from 'shared/base64url';

class Register {
  async init(event: SubmitEvent) {
    // 1. Get Challenge from server (Relying Party)
    const challenge = await this.getChallenge(event)

    // 2. Use challenge to create public key credential pair
    const credentials = await this.createPublicKeyCredential(challenge);

    if (!credentials) {
      throw new Error('No credentials returned')
    }

    // 3. Send publicKey+challenge to server to create new user
    const currentUser = await this.loginWith(credentials);

    // 4. Redirect to user's dashboard
  }

  buildLoginOptionsWith(userCredentials) {
    const body = {
      response: {
        clientDataJSON: base64url.encode(
          userCredentials.response.clientDataJSON
        ),
        attestationObject: base64url.encode(
          userCredentials.response.attestationObject
        ),
      },
    }

    if (userCredentials.response.getTransports) {
      body.response.transports = userCredentials.response.getTransports()
    }

    return body
  }

  async loginWith(userCredentials) {
    const options = this.buildLoginOptionsWith(userCredentials)

    const response = await fetch('/login/public-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options)
    })

    return response.json()
  }

  async createPublicKeyCredential(challengeDto: ChallengeDto): Promise<Credential | null> {
    const options: PublicKeyCredentialCreationOptions = {
      rp: {
        name: 'testingpasskeys',
      },
      user: {
        id: base64url.decode(challengeDto.user.id),
        name: challengeDto.user.name,
        displayName: challengeDto.user.name,
      },
      challenge: base64url.decode(challengeDto.challenge),
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7, // ES256
        },
        {
          type: 'public-key',
          alg: -257, // RS256
        },
        {
          type: 'public-key',
          alg: -8, // Ed25519
        },
      ],
      authenticatorSelection: {
        userVerification: 'preferred',
      },
    };

    return navigator.credentials.create({ publicKey: { ...options } });
  }

  async getChallenge(event: SubmitEvent) {
    if (!(event.target instanceof HTMLFormElement)) {
        throw new Error('Expected event target to be a form element')
    }

    const response = await fetch('/api/webauthn/challenge', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(event.target),
    })

    return response.json()
  }
}

@customElement('auth-view')
export class LoginView extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  render() {
    return html`
      <section>
        <header>
          <h1>Register</h1>
        </header>

        <form @submit=${this._onSubmitRegister}>
          <label for="email">Email</label>
          <input
            required
            id="email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="Enter your email"
          />

          <button type="submit">Register</button>
        </form>
      </section>

      <br />
      <hr />
      <br />

      <section>
        <header>
          <h1>Login</h1>
        </header>

        <form @submit=${this._onSubmitLogin}>
          <label for="username">Username</label>
          <input id="username" type="text" />
          <label for="password">Password</label>
          <input id="password" type="password" />
          <button type="submit">Login</button>
          <slot></slot>
          <p>I am inside the shadow DOM</p>
        </form>
      </section>
    `
  }

  private _onSubmitLogin() {
    alert("not implemented submit login");
  }

  private async _onSubmitRegister(event: SubmitEvent) {
    event.preventDefault();

    const register = new Register();

    await register.init(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'auth-view': LoginView
  }
}
