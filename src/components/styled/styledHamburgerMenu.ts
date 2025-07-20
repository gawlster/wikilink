import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('styled-hamburger-menu')
export class StyledHamburgerMenu extends LitElement {
    @state()
    private open = false;

    static styles = css`
:host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
}

.hamburger {
    width: 15px;
    height: 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    z-index: 2;
}

.bar {
    height: 2px;
    background-color: #333;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.bar1.open {
    transform: translateY(4.5px) rotate(45deg);
}

.bar2.open {
    opacity: 0;
}

.bar3.open {
    transform: translateY(-4.5px) rotate(-45deg);
}

.menu {
    position: absolute;
    top: 25px;
    right: 0;
    left: 0;
    height: auto;
    padding: 12px;
    border-radius: 4px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: none;
    flex-direction: column;
    min-width: 150px;
    z-index: 2;
}

.menu.open {
    display: flex;
}

::slotted(a), ::slotted(button) {
    padding: 10px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
}

::slotted(a:hover), ::slotted(button:hover) {
    background-color: #f0f0f0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* dimmed background */
  z-index: 1; /* below menu, above everything else */
  pointer-events: auto;
}
`;

    private toggleMenu() {
        this.open = !this.open;
    }

    render() {
        return html`
${this.open
                ? html`<div class="overlay" @click=${this.toggleMenu}></div>`
                : null}
<div class="hamburger" @click=${this.toggleMenu}>
    <div class="bar bar1 ${this.open ? 'open' : ''}"></div>
    <div class="bar bar2 ${this.open ? 'open' : ''}"></div>
    <div class="bar bar3 ${this.open ? 'open' : ''}"></div>
</div>
<div class="menu ${this.open ? 'open' : ''}">
    <slot></slot>
</div>
`;
    }
}
