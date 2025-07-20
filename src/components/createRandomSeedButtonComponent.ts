import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createSeedFromCompletedGame } from "../communication";

@customElement("create-random-seed-button-component")
class CreateRandomSeedButtonComponent extends LitElement {
    @property({ type: String })
    newlyCreatedSeed: string | undefined = undefined;
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
        if (this.newlyCreatedSeed) {
            return html`
<p>Seed created successfully! Use the following ID to play again or share with friends:</p>
<p>${this.newlyCreatedSeed}</p>
`
        }
        return html`
<styled-button
    buttonType="ghost"
    label="Create Seed for this Game"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
`
    }

    private async handleSubmit() {
        await createSeedFromCompletedGame(this.gameId);
    }
}
