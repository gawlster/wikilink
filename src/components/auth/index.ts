import "./loginForm";
import "./registerForm";
import "./requestPasswordResetForm";
import "./resetPasswordForm";
import { customElement, property, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import { updateAuthStorage } from "../../authStorage";

@customElement("auth-component")
class AuthComponent extends LitElement {
    @property({ type: String })
    resettingPasswordForEmail: string = "";

    @state()
    private currentForm: "login" | "register" | "requestPasswordReset" = "login";

    static styles = css`
`

    switchToRegister() {
        this.currentForm = "register";
    }
    switchToLogin() {
        this.currentForm = "login";
    }
    async switchToLoginAndClearPasswordResetStorage() {
        await updateAuthStorage({
            resettingPasswordForEmail: ""
        })
        this.switchToLogin();
    }
    switchToRequestPasswordReset() {
        this.currentForm = "requestPasswordReset";
    }

    render() {
        if (this.resettingPasswordForEmail) {
            return html`
<reset-password-form-component email=${this.resettingPasswordForEmail} .switchToLogin=${() => this.switchToLoginAndClearPasswordResetStorage()}></reset-password-form-component>
`;
        } else if (this.currentForm === "login") {
            return html`
<login-form-component .switchToRegister=${() => this.switchToRegister()} .switchToRequestPasswordReset=${() => this.switchToRequestPasswordReset()}></login-form-component>
`;
        } else if (this.currentForm === "register") {
            return html`
<register-form-component .switchToLogin=${() => this.switchToLogin()}></register-form-component>
`;
        } else if (this.currentForm === "requestPasswordReset") {
            return html`
<request-password-reset-form-component .switchToLogin=${() => this.switchToLogin()}></request-password-reset-form-component>
`;
        }
    }
}
