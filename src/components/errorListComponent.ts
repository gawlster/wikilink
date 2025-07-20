import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Error, getErrorStorage } from "../errorStorage";

@customElement("error-list-component")
class ErrorListComponent extends LitElement {
    @state()
    errors: Error[] = [];

    private async fetchErrorsFromStorage() {
        super.connectedCallback();
        const errorStorage = await getErrorStorage();
        console.log("Changing state: ", errorStorage?.errors);
        this.errors = errorStorage?.errors || [];
    }

    connectedCallback(): void {
        this.fetchErrorsFromStorage();
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                this.fetchErrorsFromStorage();
            }
        });
    }

    static styles = css`
`

    render() {
        return html`
${this.errors.map((error) => {
            return html`
<error-component .error=${error}></error-component>
`
        })}
`
    }
}
