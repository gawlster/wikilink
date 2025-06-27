import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("no-game-in-progress-component")
class NoGameInProgressComponent extends LitElement {
    render() {
        return html`
<div>
    <p>No game in progress.</p>
    <button class="start-game-button">Start Game</button>
</div>
`;
    }
}
