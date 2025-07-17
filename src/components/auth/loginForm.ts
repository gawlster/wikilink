import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { login } from "../../communication";

@customElement("login-form-component")
class LoginFormComponent extends LitElement {
    @property({ attribute: false, type: Function })
    switchToRegister: () => void = () => { };

    @state()
    private email: string = "";
    private onEmailInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.email = input.value;
    }

    @state()
    private password: string = "";
    private onPasswordInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.password = input.value;
    }

    static styles = css`
:host {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-pair {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.switch-form {
    cursor: pointer;
}
`

    render() {
        return html`
<h2>Login</h2>
<div class="input-pair">
    <label for="email">Email:</label>
    <input
        type="email"
        id="email"
        name="email"
        required
        .value=${this.email}
        @input=${this.onEmailInput}
    >
</div>

<div class="input-pair">
    <label for="password">Password:</label>
    <input
        type="password"
        id="password"
        name="password"
        required
        .value=${this.password}
        @input=${this.onPasswordInput}
    >
</div>

<styled-button
    buttonType="primary"
    label="Login"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
<p class="switch-form" @click=${this.switchToRegister}>Register instead</p>
`;
    }

    private async handleSubmit() {
        try {
            await login(this.email, this.password);
        } catch (error) {
            console.error("Login failed:", error);
            // Handle login failure (e.g., show an error message)
        }
    }
}
