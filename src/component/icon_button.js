import { MDCRipple } from '@material/ripple';
import { LitElement, html } from 'lit';

class IconButton extends LitElement {
    static properties = {
        icon: {type: String},
    }
    render () {
        return html`
            <div class="mdc-icon-button__ripple"></div>
            ${this.icon}
        `;
    }
    firstUpdated () {
        this.icon_button = new MDCRipple(this);
        this.classList.add('mdc-icon-button');
        this.classList.add('material-icons');
        this.icon_button.unbounded = true;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-icon-button', IconButton);
