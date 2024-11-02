import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('main-nav')
export class Nav extends LitElement {
  render() {
    return html`
      <nav>
        <a href="/">Home</a>
        <a href="/register.html">Register</a>
        <a href="/login.html">Login</a>
      </nav>
    `;
  }
}