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

    @property({ type: String })
    gameId: string = "";

    static styles = css`
:host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    gap: 28px;
}
p {
    margin: 0;
    padding: 0;
}
.divider {
    width: 100%;
    height: 1px;
    background-color: #223344;
}
.steps {
    font-size: 1.2em;
    color: #223344;
    text-align: center;
    font-weight: bold;
}
.article-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
}
.label {
    font-weight: normal;
    font-size: 1.1em;
    color: #223344;
    text-align: center;
}
.value {
    font-weight: bold;
    font-size: 1.3em;
    color: #223344;
    text-align: center;
}
`

    render() {
        return html`
<p class="steps">Steps: ${this.stepsTaken} / ${this.minSteps}</p>
<div class="divider"></div>
<div class="article-info">
    <p class="label">Start Article</p>
    <p class="value">${this.startArticleUrl ? getTitleFromUrl(this.startArticleUrl) : "Loading..."}</p>
</div>
<div class="divider"></div>
<div class="article-info">
    <p class="label">Target Article</p>
    <p class="value">${this.endArticleUrl ? getTitleFromUrl(this.endArticleUrl) : "Loading..."}</p>
</div>
<give-up-game-button-component buttonText="Give Up" gameId=${this.gameId}></give-up-game-button-component>
`
    }
}
