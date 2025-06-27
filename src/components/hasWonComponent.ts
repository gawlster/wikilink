import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("has-won-component")
class HasWonComponent extends LitElement {
    @property({ type: Number })
    stepsTaken: number = 0;

    @property({ type: Number })
    minSteps: number = 0;

    render() {
        return html`
<div>
    <h1>Congratulations!</h1>
    <p>You reached the target page in ${this.stepsTaken} steps.</p>
    <p>The best score for this pair is ${this.minSteps} steps.</p>
    <button class="start-game-button">Play Again</button>
</div>
`;
    }
}
