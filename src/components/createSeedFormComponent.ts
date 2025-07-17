/*
 * This component is only used to setup initial seeds. It should not be shown to users
 */

import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getNormalizedTitle } from "../utils";
import { createSeed } from "../communication";

@customElement("create-seed-form-component")
class CreateSeedFormComponent extends LitElement {
    @state()
    private startArticle: string = "";
    private onStartArticleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.startArticle = input.value;
    }

    @state()
    private endArticle: string = "";
    private onEndArticleInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.endArticle = input.value;
    }

    @state()
    private steps: number = 0;
    private onStepsInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.steps = parseInt(input.value, 10);
    }

    @state()
    private category: string = "";
    private onCategoryInput(e: Event) {
        const input = e.target as HTMLInputElement;
        this.category = input.value;
    }

    static styles = css`
`

    render() {
        return html`
<h2>Create a new seed</h2>
<div class="input-pair">
    <label for="start-article">Start Article:</label>
    <input
        type="text"
        id="start-article"
        name="start-article"
        required
        .value=${this.startArticle}
        @input=${this.onStartArticleInput}
    >
</div>
<div class="input-pair">
    <label for="end-article">End Article:</label>
    <input
        type="text"
        id="end-article"
        name="end-article"
        required
        .value=${this.endArticle}
        @input=${this.onEndArticleInput}
    >
</div>
<div class="input-pair">
    <label for="steps">Steps:</label>
    <input
        type="number"
        id="steps"
        name="steps"
        required
        .value=${this.steps}
        @input=${this.onStepsInput}
    >
</div>
<div class="input-pair">
    <label for="category">Category:</label>
    <input
        type="text"
        id="category"
        name="category"
        required
        .value=${this.category}
        @input=${this.onCategoryInput}
    >
</div>
<styled-button
    buttonType="primary"
    label="Create Seed"
    .onClick=${() => this.handleSubmit()}
>
</styled-button>
`
    }

    private async handleSubmit() {
        try {
            await createSeed(this.startArticle, this.endArticle, this.steps, this.category);
            this.startArticle = "";
            this.endArticle = "";
            this.steps = 0;
            this.category = "";
        } catch (error) {
            console.error("Seed creation failed:", error);
            // Handle login failure (e.g., show an error message)
        }
    }
}
