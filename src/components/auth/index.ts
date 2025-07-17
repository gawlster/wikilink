import "./loginForm";
import "./registerForm";
import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";

@customElement("auth-component")
class AuthComponent extends LitElement {
    @state()
    private currentForm: "login" | "register" = "login";

    static styles = css`
`

    switchToRegister() {
        this.currentForm = "register";
    }
    switchToLogin() {
        this.currentForm = "login";
    }

    render() {
        if (this.currentForm === "login") {
            return html`
                <login-form-component .switchToRegister=${() => this.switchToRegister()}></login-form-component>
            `;
        } else if (this.currentForm === "register") {
            return html`
                <register-form-component .switchToLogin=${() => this.switchToLogin()}></register-form-component>
            `;
        }
    }
}
