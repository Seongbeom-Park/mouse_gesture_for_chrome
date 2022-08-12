import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { MDCTextField } from '@material/textfield';

export class TextField extends LitElement {
    static properties = {
        label: {type: String},
        default_value: {type: String},
        placeholder: {type: String},
        helper: {type: String},
        pattern: {type: String},

        required: {type: Boolean},
        disabled: {type: Boolean},

        onkeydown: {type: Object},
    }
    get value () {
        return this.text_field.value;
    }
    set value (_value) {
        this.text_field.value = _value;
    }
    get valid () {
        return this.text_field.valid;
    }
    set valid (_valid) {
        this.text_field.valid = _valid;
    }
    render () {
        this.text_field_ref = createRef();
        return html`
            <label ${ref(this.text_field_ref)} class="mdc-text-field mdc-text-field--outlined ${when(this.default_value, () => 'mdc-text-field--label-floating')} ${this.classList.value}">
                <span class="mdc-notched-outline">
                    <span class="mdc-notched-outline__leading"></span>
                    <span class="mdc-notched-outline__notch">
                        ${when(this.label, () => html`<span class="mdc-floating-label ${when(this.default_value, () => 'mdc-floating-label--float-above')}" id="my-label-id">${this.label}</span>`)}
                    </span>
                    <span class="mdc-notched-outline__trailing"></span>
                </span>
                <input type="text" class="mdc-text-field__input" aria-labelledby="my-label-id"
                    value=${ifDefined(this.default_value)}
                    placeholder=${ifDefined(this.placeholder)}
                    pattern="${ifDefined(this.pattern)}"
                    @keydown="${(e) => { if (this.onkeydown) this.onkeydown(e); }}"
                    @input="${() => { this.valid = this.valid ? this.valid : this.value === this.default_value; }}"
                    >
            </label>
            ${when(this.helper, () => html`
                <div class="mdc-text-field-helper-line">
                    <div class="mdc-text-field-helper-text--validation-msg" id="my-helper-id" aria-hidden="true">${this.helper}</div>
                </div>
            `)}
        `;
    }
    firstUpdated () {
        this.text_field = new MDCTextField(this.text_field_ref.value);
        this.text_field.required = this.required;
        this.text_field.disabled = this.disabled;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-text-field', TextField);
