import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { startNewGame, startNewGameFromSeed } from "../communication";
import { ActiveGame } from "../serverTypes";

@customElement("start-game-button-component")
class StartGameButtonComponent extends LitElement {
    @property({ type: String })
    buttonText = "Start Game";

    @property({ type: String })
    seed = "";

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
        let activeGame: ActiveGame;
        if (this.seed.trim() === "") {
            const { success, json } = await startNewGame();
            if (!success) {
                return;
            }
            activeGame = json;
        } else {
            const { success, json } = await startNewGameFromSeed(this.seed);
            if (!success) {
                return;
            }
            activeGame = json;
        }
        await chrome.runtime.sendMessage({
            type: "gameStarted",
            game: activeGame
        })
    }
    render() {
        return html`
<styled-button
    buttonType="primary"
    label=${this.buttonText}
    .onClick=${() => this.startGame()}
>
</styled-button>`;
    }
}
