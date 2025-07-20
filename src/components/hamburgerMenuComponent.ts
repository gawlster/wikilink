import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { logout } from "../communication";
import { getAuthStorage } from "../authStorage";

@customElement("hamburger-menu-component")
class HamburgerMenuComponent extends LitElement {
    @state()
    private isLoggedIn: boolean = false;
    private async checkIfLoggedIn() {
        const authStorage = await getAuthStorage();
        if (authStorage.accessToken) {
            console.log("User is logged in");
            this.isLoggedIn = true;
        }
        else {
            console.log("User is not logged in");
            this.isLoggedIn = false;
        }
    }
    async connectedCallback() {
        super.connectedCallback();
        this.checkIfLoggedIn();
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                this.checkIfLoggedIn();
            }
        });
    }

    static styles = css`
.source-code-button {
    margin-top: 16px;
}
`

    render() {
        return html`
<styled-hamburger-menu>
    <styled-button
        buttonType="ghost"
        label="Logout"
        .onClick=${() => this.handleLogout()}
        ?disabled=${!this.isLoggedIn}
    >
    </styled-button>
    <styled-button
        class="source-code-button"
        buttonType="link"
        label="Source Code"
        .onClick=${() => this.handleOpenSourceCode()}
    >
    </styled-button>
</styled-hamburger-menu>
            `;
    }

    private async handleLogout() {
        await logout();
    }

    private handleOpenSourceCode() {
        chrome.tabs.create({
            url: "https://github.com/gawlster/wikilink-client"
        })
    }
}
