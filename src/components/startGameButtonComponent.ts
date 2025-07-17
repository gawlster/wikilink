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
            activeGame = await startNewGame();
        } else {
            activeGame = await startNewGameFromSeed(this.seed);
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
