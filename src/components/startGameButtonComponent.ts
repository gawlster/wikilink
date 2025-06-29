import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getRandomStartAndEnd } from "../gameInitialization";

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
        const gameData = await getRandomStartAndEnd();
        await chrome.runtime.sendMessage({
            type: "OpenStartArticle",
            gameData
        })
    }
    render() {
        return html`<button @click=${this.startGame}>${this.buttonText}</button>`;
    }
}
