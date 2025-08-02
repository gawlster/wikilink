import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { register } from "../../communication";

@customElement("register-form-component")
class RegisterFormComponent extends LitElement {
    @property({ attribute: false, type: Function })
    switchToLogin: () => void = () => { };

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

    @state()
    private confirmPassword: string = "";
    private onConfirmPasswordInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.confirmPassword = input.value;
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
<h2>Register</h2>
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

<div class="input-pair">
    <label for="confirmPassword">Confirm Password:</label>
    <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        required
        .value=${this.confirmPassword}
        @input=${this.onConfirmPasswordInput}
    >
</div>

<styled-button
    buttonType="primary"
    label="Register"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
<p class="switch-form" @click=${this.switchToLogin}>Login instead</p>
`;
    }

    private async handleSubmit() {
        await register(this.email, this.password, this.confirmPassword);
    }
}
