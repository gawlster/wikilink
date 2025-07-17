import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("no-game-in-progress-component")
class NoGameInProgressComponent extends LitElement {
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
        <label for="difficulty">Select difficulty</label>
        <styled-range-input id="difficulty"></styled-range-input>
    </div>
    <start-game-button-component buttonText="Start Game" fullWidth=${true}></start-game-button-component>
</div>
`;
    }
}
