import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("styled-range-input")
class StyledRangeInput extends LitElement {
    @property({ type: String })
    id = "";

    static styles = css`
input[type="range"] {
   -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
   background-color: #b5d0ec;
   border-radius: 0.5rem;
   height: 0.5rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
   appearance: none;
   margin-top: -12px;
   background-color: #335c85;
   height: 2rem;
   width: 1rem;
}

input[type="range"]:focus::-webkit-slider-thumb {
  border: 1px solid #b5d0ec;
  outline: 3px solid #b5d0ec;
  outline-offset: 0.125rem;
}

input[type="range"]::-moz-range-track {
   background-color: #b5d0ec;
   border-radius: 0.5rem;
   height: 0.5rem;
}

input[type="range"]::-moz-range-thumb {
   border: none;
   border-radius: 0;
   background-color: #335c85;
   height: 2rem;
   width: 1rem;
}

input[type="range"]:focus::-moz-range-thumb {
  border: 1px solid #b5d0ec;
  outline: 3px solid #b5d0ec;
  outline-offset: 0.125rem;
}
`

    render() {
        return html`
<input id=${this.id} name=${this.id} type="range" min="1" max="5"></input>
`;
    }
}
