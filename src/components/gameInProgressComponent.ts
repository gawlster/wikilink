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
:host {
    display: block;
    padding: 16px;
    background-color: var(--game-in-progress-bg, #f0f0f0);
}
`;

    render() {
        return html`
<div>
    <p>Game in progress...</p>
    <p>You started at ${getTitleFromUrl(this.startArticleUrl)} and are trying to reach ${getTitleFromUrl(this.endArticleUrl)}.</p>
    <p>You have taken ${this.stepsTaken} steps so far.</p>
    <p>The best score for this pair is ${this.minSteps} steps.</p>
    <give-up-game-button-component buttonText="Give Up"></give-up-game-button-component>
</div>
`
    }
}
