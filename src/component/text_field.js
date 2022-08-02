import { LitElement, html } from 'lit';
import { MDCTextField } from '@material/textfield';

export class TextField extends LitElement {
    static properties = {
        label: {type: String},
    }
    get value () {
        return this.text_field.value;
    }
    constructor () {
        super();
        this.classList.add('mdc-text-field');
        this.classList.add('mdc-text-field--outlined');
    }
    render () {
        return html`
            <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    ${this.label && html`<span class="mdc-floating-label" id="my-label-id">${this.label}</span>`}
                </span>
                <span class="mdc-notched-outline__trailing"></span>
            </span>
            <input type="text" class="mdc-text-field__input" aria-labelledby="my-label-id">
        `;
    }
    firstUpdated () {
        this.text_field = new MDCTextField(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-text-field', TextField);
