import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { clearGameStorage } from "../gameStorage";

@customElement("give-up-game-button-component")
class GiveUpGameButtonComponent extends LitElement {
    @property({ type: String })
    buttonText = "Give Up";

    @property({ type: String })
    gameId = "";

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
    render() {
        return html`
<styled-button
    buttonType="danger"
    label=${this.buttonText}
    .onClick=${async () => await clearGameStorage()}
>
</styled-button>`;
    }
}
