import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { requestResetPasswordCode } from "../../communication";

@customElement("request-password-reset-form-component")
class RequestPasswordResetFormComponent extends LitElement {
    @property({ attribute: false, type: Function })
    switchToLogin: () => void = () => { };

    @state()
    private email: string = "";
    private onEmailInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.email = input.value;
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
<h2>Reset Password</h2>
<p>Enter your email address. We will email you instructions to reset your password.</p>
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

<styled-button
    buttonType="primary"
    label="Reset Password"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
<p class="switch-form" @click=${this.switchToLogin}>Back to login</p>
`;
    }

    private async handleSubmit() {
        await requestResetPasswordCode(this.email);
    }
}
