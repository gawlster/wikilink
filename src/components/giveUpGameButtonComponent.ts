import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("give-up-game-button-component")
class GiveUpGameButtonComponent extends LitElement {
    @property({ type: String })
    buttonText = "Give Up";

    static styles = css`
        button {
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    `;
    async giveUp() {
        await chrome.runtime.sendMessage({
            type: "GiveUpGame",
        })
        window.close();
    }
    render() {
        return html`<styled-button buttonType="danger" label=${this.buttonText} @click=${this.giveUp}></styled-button>`;
    }
}
