import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { MDCTextField } from '@material/textfield';

export class TextField extends LitElement {
    static properties = {
        label: {type: String},
        default_value: {type: String},
        placeholder: {type: String},
    }
    get value () {
        return this.text_field.value;
    }
    set value (_value) {
        this.text_field.value = _value;
    }
    render () {
        return html`
            <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                <span class="mdc-notched-outline__notch">
                    ${when(this.label, () => html`<span class="mdc-floating-label" id="my-label-id">${this.label}</span>`)}
                </span>
                <span class="mdc-notched-outline__trailing"></span>
            </span>
            <input type="text" class="mdc-text-field__input" aria-labelledby="my-label-id"
                value=${ifDefined(this.default_value)} placeholder=${ifDefined(this.placeholder)}>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        this.classList.add('mdc-text-field');
        this.classList.add('mdc-text-field--outlined');
    }
    firstUpdated () {
        this.text_field = new MDCTextField(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-text-field', TextField);
