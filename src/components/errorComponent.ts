import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { dismissErrorFromStorage, Error } from "../errorStorage";

@customElement("error-component")
class ErrorComponent extends LitElement {
    @property({ type: Object })
    error: Error | null = null;

    static styles = css`
.outer {
    background-color: #f8d7da;
    color: #000000;
    padding: 8px;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    position: relative;
    margin-bottom: 4px;
}
.dismiss {
    cursor: pointer;
    color: #721c24;
    font-weight: bold;
    position: absolute;
    right: 4px;
    top: 4px;
}
p {
    margin: 0;
}
`

    render() {
        if (!this.error) {
            return null;
        }
        return html`
<div class="outer">
    <p>${this.error.message}</p>
    <span class="dismiss" @click=${this.handleDismiss}>X</span>
</div>
`
    }

    private async handleDismiss() {
        if (this.error) {
            await dismissErrorFromStorage(this.error.id);
        }
    }
}
