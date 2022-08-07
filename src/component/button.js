import { LitElement, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { MDCRipple } from '@material/ripple';

class Button extends LitElement {
    static properties = {
        icon: {type: String},
        value: {type: String},
        emphasis: {type: String, status: true}, // 'low', 'medium', 'high'
    }
    render () {
        if (this.icon)  this.classList.add('mdc-button--icon-leading');

        return html`
            <span class="mdc-button__ripple"></span>
            ${when(this.icon, () => html`<i class="material-icons mdc-button__icon" aria-hidden="true">${this.icon}</i>`)}
            <span class="mdc-button__label">${this.value}</span>
        `;
    }
    firstUpdated () {
        this.button = new MDCRipple(this);
        this.classList.add('mdc-button');
    }
    updated () {
        switch (this.emphasis){
            case 'low':
                this.classList.remove('mdc-button--outlined');
                this.classList.remove('mdc-button--raised');
                break;
            default:
            case 'medium':
                this.classList.add('mdc-button--outlined');
                this.classList.remove('mdc-button--raised');
                break;
            case 'high':
                this.classList.remove('mdc-button--outlined');
                this.classList.add('mdc-button--raised');
                break;
        }
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-button', Button);
