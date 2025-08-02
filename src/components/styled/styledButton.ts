import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type ButtonType = "primary" | "danger" | "ghost" | "link";

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

    @property({ type: Boolean, reflect: true, attribute: 'fullwidth' })
    fullWidth: boolean = false

    @state()
    loading: boolean = false

    static styles = css`
:host[fullWidth] {
    width: 100%;
}
button {
    font-size: 1em;
    font-weight: bold;
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease;
    width: 100%;
}
button[buttonType="primary"] {
    background-color: #d4a639;
    color: white;
}
button[buttonType="primary"]:hover {
    background-color: #b88f2f;
}
button[buttonType="primary"]:active {
    background-color: #a87f25;
}
button[buttonType="ghost"] {
    background-color: transparent;
    color: #333;
    border: 2px solid #333;
}

button[buttonType="ghost"]:hover {
    background-color: #333;
    color: white;
}

button[buttonType="ghost"]:active {
    background-color: #222;
    border-color: #222;
}
button[buttonType="danger"] {
    background-color: #c1433f;
    color: white;
}
button[buttonType="danger"]:hover {
    background-color: #a63632;
}
button[buttonType="danger"]:active {
    background-color: #8f2e2a;
}
button[buttonType="link"] {
    background: none;
    color: #333;
    border: none;
    padding: 0;
    font-weight: bold;
    cursor: pointer;
}

button[buttonType="link"]:hover {
    color: #000;
}

button[buttonType="link"]:active {
    color: #555;
}
button:disabled {
    background-color: #dcdcdc;
    cursor: not-allowed;
}
button:disabled:hover {
    background-color: #dcdcdc;
    color: #666;
}
button[loading] {
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
    ${this.loading ? "Loading..." : this.label}
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
