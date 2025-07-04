import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("testing-component")
class TestingComponent extends LitElement {
    static styles = css`
        :host {
        display: block;
        padding: 16px;
        background-color: var(--testing-component-bg, #f0f0f0);
        }
    `;

    render() {
        return html`
        <div>
            <h2>Testing Component</h2>
            <p>This is a simple testing component.</p>
        </div>
        `;
    }
}
