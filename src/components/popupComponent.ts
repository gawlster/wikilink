import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { getStorage, Storage, storageKeys } from "../storage";

@customElement("popup-component")
class PopupComponent extends LitElement {
    @state()
    private state: Storage | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.fetchStateFromStorage();
    }

    async fetchStateFromStorage() {
        const storedState = await getStorage();
        this.state = storedState;
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
            return html`<has-won-component stepsTaken=${this.state.visitedUrls.length - 1} minSteps=${this.state.minSteps}></has-won-component>`;
        } else if (this.state.id) {
            return html`<game-in-progress-component
                startArticleUrl=${this.state.startingArticleUrl}
                endArticleUrl=${this.state.endingArticleUrl}
                stepsTaken=${this.state.visitedUrls.length - 1}
                minSteps=${this.state.minSteps}
                gameId=${this.state.id}
            ></game-in-progress-component>`;
        } else {
            return html`<no-game-in-progress-component></no-game-in-progress-component>`;
        }
    }

    render() {
        return html`
<h1>WikiLink</h1>
<p>Note: The interface of this extension is still in development. It may lag behind game state by a couple seconds. Closing and reopening the popup will trigger a refresh.</p>
${this.getMainComponent()}
`
    }
}
