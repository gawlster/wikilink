import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getTitleFromUrl } from "../utils";

@customElement("game-in-progress-component")
class GameInProgressComponent extends LitElement {
    @property({ type: String })
    startArticleUrl: string = "";

    @property({ type: String })
    endArticleUrl: string = "";

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
    <p>Current Score: <span>${this.stepsTaken}</span></p>
    <p>Minimum possible score for this pair: <span>${this.minSteps}</span></p>
    <p>You started at <span>${getTitleFromUrl(this.startArticleUrl)}</span></p>
    <p>You are trying to reach <span>${getTitleFromUrl(this.endArticleUrl)}</span></p>
    <give-up-game-button-component buttonText="Give Up"></give-up-game-button-component>
</div>
`
    }
}
