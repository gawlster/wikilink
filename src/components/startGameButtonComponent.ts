import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { startNewGame } from "../communication.js";

@customElement("start-game-button-component")
class StartGameButtonComponent extends LitElement {
    @property({ type: String })
    buttonText = "Start Game";

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
    async startGame() {
        const gameData = await startNewGame();
        await chrome.runtime.sendMessage({
            type: "StartGame",
            gameData
        })
    }
    render() {
        return html`
<styled-button
    buttonType="primary"
    label=${this.buttonText}
    .onClick=${this.startGame}
>
</styled-button>`;
    }
}
