import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type ButtonType = "primary" | "danger";

@customElement("styled-button")
class StyledButton extends LitElement {
    @property({ type: String })
    label: string = ""

    @property({ type: String })
    buttonType: ButtonType = "primary"

    @property({ type: Boolean })
    disabled: boolean = false

    @property({ attribute: false, type: Function })
    onClick: ((e: MouseEvent) => void | Promise<void>) | null = null

    @state()
    loading: boolean = false

    static styles = css`
button {
    font-size: 1em;
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;
}
button[buttonType="primary"] {
    background-color: #4CAF50;
    color: white;
}
button[buttonType="primary"]:hover {
    background-color: #45a049;
}
button[buttonType="danger"] {
    background-color: #f44336;
    color: white;
}
button[buttonType="danger"]:hover {
    background-color: #d32f2f;
}
button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
button[loading] {
    filter: brightness(0.8);
    cursor: wait;
}
`

    render() {
        return html`
<button
    ?disabled=${this.disabled}
    @click=${(e: MouseEvent) => this._onClick(e)}
    buttonType=${this.buttonType}
    ?loading=${this.loading}
>
    ${this.label}
</button>
`
    }

    private _onClick(e: MouseEvent) {
        if (this.disabled || this.loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        this.loading = true;
        if (this.onClick) {
            const result = this.onClick(e);
            if (result instanceof Promise) {
                result.finally(() => this.loading = false);
            } else {
                this.loading = false;
            }
        }
    }
}
