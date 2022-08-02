import { LitElement, html } from 'lit';
import { MDCMenu } from '@material/menu';

class DropdownMenu extends LitElement {
    constructor () {
        super();
        this.classList.add('mdc-menu');
        this.classList.add('mdc-menu-surface');
    }
    open () {
        this.menu.open = true;
    }
    setFixedPosition (value) {
        this.menu.setFixedPosition(value);
    }
    setAnchorElement (elem) {
        this.menu.setAnchorElement(elem);
    }
    render () {
        return html`
            <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
                <li class="mdc-list-item" role="menuitem">
                    <span class="mdc-list-item__ripple"></span>
                    <span class="mdc-list-item__text">Add space before paragraph</span>
                </li>
            </ul>
      `;
    }
    firstUpdated () {
        this.menu = new MDCMenu(this);
        this.dispatchEvent(new Event('firstUpdated'));
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-menu', DropdownMenu);
