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
    <h2>You won!</h2>
    <p>Your score: <span>${this.stepsTaken}</span></p>
    <p>Minimum possible score: <span>${this.minSteps}</span></p>
    <start-game-button-component buttonText="Play Again"></start-game-button-component>
</div>
`;
    }
}
