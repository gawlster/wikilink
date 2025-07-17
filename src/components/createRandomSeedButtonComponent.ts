import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createSeedFromCompletedGame } from "../communication";

@customElement("create-random-seed-button-component")
class CreateRandomSeedButtonComponent extends LitElement {
    @state()
    seedId = "";
    @property({ type: String })
    gameId = "";
    @property({ type: String })
    createdFromSeed: string | undefined = undefined;

    static styles = css`
`

    render() {
        if (this.createdFromSeed) {
            return html`
<p>This game was created from an existing seed. Use the following ID to play again or share with friends:</p>
<p>${this.createdFromSeed}</p>
`
        }
        if (this.seedId) {
            return html`
<p>Seed created successfully! Use the following ID to play again or share with friends:</p>
<p>${this.seedId}</p>
`
        }
        return html`
<styled-button
    buttonType="primary"
    label="Create Seed for this Game"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
`
    }

    private async handleSubmit() {
        try {
            const seed = await createSeedFromCompletedGame(this.gameId);
            this.seedId = seed.id;
        } catch (error) {
            console.error("Seed creation from completed game failed:", error);
            // Handle login failure (e.g., show an error message)
        }
    }
}
