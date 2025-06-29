import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("has-won-component")
class HasWonComponent extends LitElement {
    @property({ type: Number })
    stepsTaken: number = 0;

    @property({ type: Number })
    minSteps: number = 0;

    static styles = css`
span {
    font-weight: bold;
}
`

    render() {
        return html`
<div>
    <p>Your score: <span>${this.stepsTaken}</span></p>
    <p>Minimum possible score for this pair: <span>${this.minSteps}</span></p>
    <start-game-button-component buttonText="Play Again"></start-game-button-component>
</div>
`;
    }
}
