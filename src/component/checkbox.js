import { LitElement, html, unsafeCSS } from 'lit';

class Checkbox extends LitElement {
    static properties = {
        aria_label: {type: String},
        aria_labelledby: {type: String},
        checked: {type: Boolean, attribute: true},
    }
    constructor () {
        super();
        this.classList.add('mdc-checkbox');
    }
    createInput () {
        const aria_label = this.aria_label ? html`aria-label="${this.aria_label}"` : html``;
        const aria_labelledby = this.aria_labelledby ? html`aria_labelledby="${this.aria_labelledby}"` : html``;
        this.checked ??= false;
        if (this.checked) return html`<input type="checkbox" class="mdc-checkbox__native-control" ${unsafeCSS(aria_label)} ${unsafeCSS(aria_labelledby)} checked />`;
        else return html`<input type="checkbox" class="mdc-checkbox__native-control" ${unsafeCSS(aria_label)} ${unsafeCSS(aria_labelledby)} />`;
    }
    render () {
        return html`
            ${this.createInput()}
            <div class="mdc-checkbox__background">
                <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                </svg>
                <div class="mdc-checkbox__mixedmark"></div>
            </div>
            <div class="mdc-checkbox__ripple"></div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-checkbox', Checkbox);