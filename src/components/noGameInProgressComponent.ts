import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("no-game-in-progress-component")
class NoGameInProgressComponent extends LitElement {
    @state()
    private seed: string = "";
    private onSeedInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.seed = input.value;
    }

    static styles = css`
:host {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.input-pair {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
    gap: 16px;
}
.content {
    display: flex;
    flex-direction: column;
    gap: 28px;
}
`
    render() {
        return html`
<div class="rules">
    <h3>Rules</h3>
    <p>Navigate by clicking links only.</p>
    <p>Reach the target article in the least steps.</p>
    <p>You may open another tab for information.</p>
    <p>Once you reach the target article, you win!</p>
    <p>Closing the game tab ends the game.</p>
    <p>Games will expire after 1 hour of inactivity.</p>
    <p>Good luck!</p>
</div>
<div class="content">
    <div class="input-pair">
        <label for="seed">Play a seeded game:</label>
        <input
            type="text"
            id="seed"
            name="seed"
            required
            .value=${this.seed}
            @input=${this.onSeedInput}
        >
    </div>
    <start-game-button-component
        buttonText="Start Game"
        fullWidth=${true}
        .seed=${this.seed}
    ></start-game-button-component>
</div>
`;
    }
}
