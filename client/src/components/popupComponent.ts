import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

type PopupState = {
    gameInProgress: boolean;
    currentTabId?: number;
    startingArticleUrl: string;
    endingArticleUrl: string;
    minSteps: number;
    stepsTaken: number;
    hasWon: boolean;
} | null;

@customElement("popup-component")
class PopupComponent extends LitElement {
    @state()
    private state: PopupState = null;

    connectedCallback() {
        super.connectedCallback();
        this.fetchStateFromStorage();
    }

    async fetchStateFromStorage() {
        const storedState = await chrome.storage.local.get([
            "gameInProgress",
            "currentTabId",
            "startingArticleUrl",
            "endingArticleUrl",
            "minSteps",
            "stepsTaken",
            "hasWon"
        ]);
        this.state = {
            gameInProgress: storedState.gameInProgress || false,
            currentTabId: storedState.currentTabId,
            startingArticleUrl: storedState.startingArticleUrl || "",
            endingArticleUrl: storedState.endingArticleUrl || "",
            minSteps: storedState.minSteps || 0,
            stepsTaken: storedState.stepsTaken || 0,
            hasWon: storedState.hasWon || false
        };
    }

    static styles = css`
:host {
    display: block;
    padding: 16px;
    background-color: var(--popup-component-bg, #f0f0f0);
    aspect-ratio: 2 / 3;
    width: 200px;
}
`;

    private getMainComponent() {
        if (this.state === null) {
            return html`<p>Loading...</p>`;
        }
        if (this.state.hasWon) {
            return html`<has-won-component stepsTaken=${this.state.stepsTaken} minSteps=${this.state.minSteps}></has-won-component>`;
        } else if (this.state.gameInProgress) {
            return html`<game-in-progress-component
                startArticleUrl=${this.state.startingArticleUrl}
                endArticleUrl=${this.state.endingArticleUrl}
                stepsTaken=${this.state.stepsTaken}
                minSteps=${this.state.minSteps}
            ></game-in-progress-component>`;
        } else {
            return html`<no-game-in-progress-component></no-game-in-progress-component>`;
        }
    }

    render() {
        return html`
<h1>WikiLink</h1>
${this.getMainComponent()}
`
    }
}
