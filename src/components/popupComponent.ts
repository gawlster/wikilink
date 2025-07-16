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
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                this.fetchStateFromStorage();
            }
        });
    }

    async fetchStateFromStorage() {
        const storedState = await getStorage();
        this.state = storedState;
    }

    static styles = css`
:host {
    background-color: #b5d0ec;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%235e5e5e' fill-opacity='0.08'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 500px;
    padding: 24px;
    font-family: "Rubik", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
}
.inner {
    height: 100%;
    padding: 20px;
    background-color: rgba(245, 243, 238, 0.4);
    border-radius: 8px;
    border: 1px solid #223344;
}
h1 {
    text-align: center;
    font-size: 1.5em;
    color: #223344;
    font-weight: bold;
}
`;

    private getMainComponent() {
        if (this.state === null) {
            return html`<p>Loading...</p>`;
        }
        if (this.state.hasWon) {
            return html`<has-won-component
                startArticleUrl=${this.state.startingArticleUrl}
                endArticleUrl=${this.state.endingArticleUrl}
                stepsTaken=${this.state.visitedUrls.length - 1}
                minSteps=${this.state.minSteps}
            ></has-won-component>`;
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
<div class="inner">
    ${this.getMainComponent()}
</div>
`
    }
}

