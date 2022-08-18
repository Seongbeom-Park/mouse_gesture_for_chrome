import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MDCDialog } from '@material/dialog';

import { translate } from '@common/translate';

export class RuleDialog extends LitElement {
    static properties = {
        title: {type: String},
        oncancle: {type: Object},
        onaccept: {type: Object},
        actions: {type: Object},
        default_values: {type: Object}
    }
    get valid () {
        if (!this.domain_input.value.valid) return false;
        if (!this.gesture_input.value.valid) return false;
        if (!this.action_input.value.valid) return false;
        if (this.action_input.value.value === 'keydown' && this.keydown_input.value.value === '') return false;
        return true;
    }
    open () {
        const getValidity = (valid, value, default_value) => valid ? valid : value === default_value;
        this.gesture_input.value.valid = getValidity(this.gesture_input.value.valid, this.gesture_input.value.value, this.default_values.gesture);
        this.action_input.value.select.valid = getValidity(this.action_input.value.select.valid, this.action_input.value.value, this.default_values.action);
        this.keydown_input.value.valid = getValidity(this.keydown_input.value.valid, this.keydown_input.value.value, this.default_values.action_details);
        this.dialog.open();
    }
    render () {
        this.domain_input = createRef();
        this.gesture_input = createRef();
        this.action_input = createRef();
        this.keydown_input = createRef();
        
        const onKeydownEvent = (keyboard_event) => {
            const parseKeyboardEvent = ({ctrlKey, altKey, shiftKey, key, code}) => {
                var value = '';
                if (ctrlKey) value += 'Ctrl + ';
                if (shiftKey) value += 'Shift + ';
                if (altKey) value += 'Alt + ';
                if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
                if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

                return value;
            }
            keyboard_event.preventDefault();

            const {ctrlKey, altKey, shiftKey, key, code, keyCode} = keyboard_event;
            this.keydown_input.value.value = parseKeyboardEvent({ctrlKey, altKey, shiftKey, key, code});
            this.keydown_input.value.action_details = {ctrlKey, altKey, shiftKey, key, code, keyCode};
        }

        const init_values = () => {
            this.domain_input.value.value = this.default_values.domain;
            this.gesture_input.value.value = this.default_values.gesture;
            this.action_input.value.value = this.default_values.action;
            this.keydown_input.value.value = this.default_values.keydown;
            this.domain_input.value.valid = true;
            this.gesture_input.value.valid = true;
            this.action_input.value.select.valid = true;
            this.keydown_input.value.valid = true;
        }

        // regex references
        // domain format: https://regexr.com/3au3g
        // gesture without double characters: https://stackoverflow.com/questions/47952922/regular-expression-exclude-double-character
        return html`
            <div class="mdc-dialog__container">
                <div class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content">
                    <div class="mdc-dialog__header">
                        ${when(this.title, () => html`<h2 class="mdc-dialog__title">${this.title}</h2>`)}
                    </div>
                    <div class="mdc-dialog__content" id="rule-dialog-content">
                        <div class="mdc-layout-grid">
                            <div class="mdc-layout-grid__inner">
                                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                                    <lm-text-field ${ref(this.domain_input)}
                                        class="dialog_input"
                                        label="도메인"
                                        default_value="${this.default_values.domain}"
                                        required
                                        pattern="((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])|[*]"
                                        ></lm-text-field>
                                </div>
                                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                                    <lm-text-field ${ref(this.gesture_input)}
                                        class="dialog_input"
                                        label="제스쳐"
                                        placeholder="[UDLR]+"
                                        required
                                        pattern="(([UDLR])(?!\\2))+"
                                        ></lm-text-field>
                                </div>
                                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                                    <lm-select ${ref(this.action_input)}
                                        class="dialog_input"
                                        label="액션"
                                        data="${JSON.stringify(this.actions.map((a) => {return {value: a, label: translate(a)}}))}"
                                        required
                                        .onchange="${() => { this.keydown_input.value.hidden = this.action_input.value.value !== 'keydown'; }}"
                                        ></lm-select>
                                </div>
                                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                                    <lm-text-field ${ref(this.keydown_input)}
                                        class="dialog_input"
                                        label="키 입력"
                                        placeholder="키 조합을 누르세요"
                                        .onkeydown="${(e) => onKeydownEvent(e)}"
                                        pattern="(Ctrl \\+ )?(Shift \\+ )?(Alt \\+ )?'[A-Z]'"
                                        required
                                        hidden
                                        ></lm-text-field>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mdc-dialog__actions">
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close"
                            @click="${init_values}">
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">취소</span>
                        </button>
                        <button type="button" class="mdc-button mdc-dialog__button"
                            @click="${() => {
                                if (this.valid) {
                                    this.onaccept({
                                        domain: this.domain_input.value.value,
                                        gesture: this.gesture_input.value.value,
                                        action: this.action_input.value.value,
                                        action_details: this.keydown_input.value.action_details,
                                    });
                                    this.dialog.close('accept');
                                    init_values();
                                } else {
                                    this.domain_input.value.value = this.domain_input.value.value;
                                    this.gesture_input.value.value = this.gesture_input.value.value;
                                    this.action_input.value.valid = this.action_input.value.value;
                                    this.keydown_input.value.value = this.keydown_input.value.value;
                                }
                            }}">
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">추가하기</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mdc-dialog__scrim"></div>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        this.classList.add('mdc-dialog');
        this.classList.add('mdc-dialog--no-content-padding');
    }
    firstUpdated () {
        this.dialog = new MDCDialog(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('rule-dialog', RuleDialog);
