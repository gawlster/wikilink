import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("no-game-in-progress-component")
class NoGameInProgressComponent extends LitElement {
    render() {
        return html`
<div>
    <p>No game in progress.</p>
    <start-game-button-component buttonText="Start Game"></start-game-button-component>
</div>
`;
    }
}
