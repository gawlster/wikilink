import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { resetPassword } from "../../communication";

@customElement("reset-password-form-component")
class RequestPasswordResetFormComponent extends LitElement {
    @property({ attribute: false, type: Function })
    switchToLogin: () => void = () => { };

    @property({ type: String })
    email: string = "";

    @state()
    private otpCode: string = "";
    private onOtpCodeInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.otpCode = input.value;
    }

    @state()
    private newPassword: string = "";
    private onNewPasswordInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.newPassword = input.value;
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
<p>If an account exists with your email address, we've sent a reset code. Enter it below along with your new password to reset your account.</p>
<div class="input-pair">
    <label for="code">Code:</label>
    <input
        type="text"
        id="code"
        name="code"
        required
        .value=${this.otpCode}
        @input=${this.onOtpCodeInput}
    >
</div>

<div class="input-pair">
    <label for="newPassword">New password:</label>
    <input
        type="password"
        id="newPassword"
        name="newPassword"
        required
        .value=${this.newPassword}
        @input=${this.onNewPasswordInput}
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
        await resetPassword(this.email, this.otpCode, this.newPassword);
    }
}
