import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getNormalizedTitle } from "../utils";
import { clearGameStorage } from "../gameStorage";

@customElement("has-won-component")
class HasWonComponent extends LitElement {
    @property({ type: String })
    startArticleUrl: string = "";

    @property({ type: String })
    endArticleUrl: string = "";

    @property({ type: Number })
    stepsTaken: number = 0;

    @property({ type: Number })
    minSteps: number = 0;

    @property({ type: String })
    gameId: string = "";

    @property({ type: String })
    createdFromSeed: string | undefined = undefined;

    @property({ type: String })
    newlyCreatedSeed: string | undefined = undefined;

    static styles = css`
:host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    gap: 28px;
}
.stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.label {
    font-weight: normal;
    font-size: 1.1em;
    color: #223344;
    text-align: start;
}
.value {
    font-weight: bold;
    font-size: 1.1em;
    color: #223344;
    text-align: end;
}
.divider {
    width: 100%;
    height: 1px;
    background-color: #223344;
}
.buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
`

    render() {
        return html`
<h2>You have reached the goal!</h2>
<div class="stats">
    <div class="stat">
        <p class="label">Start:</p>
        <p class="value">${getNormalizedTitle(this.startArticleUrl)}</p>
    </div>
    <div class="divider"></div>
    <div class="stat">
        <p class="label">End:</p>
        <p class="value">${getNormalizedTitle(this.endArticleUrl)}</p>
    </div>
    <div class="divider"></div>
    <div class="stat">
        <p class="label">Your steps:</p>
        <p class="value">${this.stepsTaken}</p>
    </div>
    <div class="divider"></div>
    <div class="stat">
        <p class="label">Minimum steps:</p>
        <p class="value">${this.minSteps}</p>
    </div>
</div>
<div class="buttons">
    <create-random-seed-button-component
        gameId=${this.gameId}
        createdFromSeed=${this.createdFromSeed}
        newlyCreatedSeed=${this.newlyCreatedSeed}
    ></create-random-seed-button-component>
    <styled-button
        buttonType="primary"
        label="Back to Homepage"
        .onClick=${() => this.backToHomepage()}
    >
    </styled-button>
</div>
`;
    }

    private async backToHomepage() {
        await clearGameStorage();
    }
}
