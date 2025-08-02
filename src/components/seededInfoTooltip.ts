import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("seeded-info-tooltip")
class SeededInfoTooltip extends LitElement {
    static styles = css`
:host {
    width: 12px;
}

svg {
    width: 12px;
    height: 12px;
}
`;

    render() {
        return html`
<styled-tooltip text="A seed is a unique identifier that allows you to replay a game or share it with others. If you do not have a valid seed, leave this field blank.">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
</styled-tooltip>
`
    }
}

