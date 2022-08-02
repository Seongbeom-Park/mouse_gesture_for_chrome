import { LitElement, html } from 'lit';
import { MDCRipple } from '@material/ripple';

class Button extends LitElement {
    static properties = {
        icon: {type: String},
        value: {type: String},
    }
    constructor () {
        super();
        this.classList.add('mdc-button');
        this.classList.add('mdc-button--outlined');
    }
    createIcon () {
        if (this.icon) {
            this.classList.add('mdc-button--icon-leading');
            return html`<i class="material-icons mdc-button__icon" aria-hidden="true">${this.icon}</i>`;
        }
    }
    render () {
        return html`
            <span class="mdc-button__ripple"></span>
            ${this.createIcon()}
            <span class="mdc-button__label">${this.value}</span>
        `;
    }
    firstUpdated () {
        this.button = new MDCRipple(this)
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-button', Button);
