import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement("styled-tooltip")
export class StyledTooltip extends LitElement {
    @property() text: string = '';
    @property({ type: Boolean }) show = false;

    static styles = css`
:host {
    position: relative;
    display: inline-block;
}

.tooltip {
    position: absolute;
    bottom: 125%; /* Above the element */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
    max-width: 200px; /* Optional: limit tooltip width */
    width: 200px;
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%; /* Arrow below tooltip */
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}

:host(:hover) .tooltip,
:host(:focus-within) .tooltip {
    opacity: 1;
    pointer-events: auto;
}
`;

    render() {
        return html`
<slot></slot>
<div class="tooltip" role="tooltip">${this.text}</div>
`;
    }
}
