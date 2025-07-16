import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { deleteGame } from "../communication";

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
    async giveUp() {
        await deleteGame({ gameId: this.gameId });
        await chrome.runtime.sendMessage({
            type: "GiveUpGame",
        })
        window.close();
    }
    render() {
        return html`
<styled-button
    buttonType="danger"
    label=${this.buttonText}
    .onClick=${async () => await this.giveUp()}
>
</styled-button>`;
    }
}
