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
    open () {
        this.dialog.open();
        this.dialog.layout();
    }
    render () {
        this.domain_input = createRef();
        this.gesture_input = createRef();
        this.action_input = createRef();
        this.keydown_input = createRef();
        const default_value = {
            domain: '*',
            gesture: '',
            action: '',
            keydown: '',
        };
        const init_values = () => {
            this.domain_input.value.value = default_value.domain;
            this.gesture_input.value.value = default_value.gesture;
            this.action_input.value.value = default_value.action;
            this.keydown_input.value.value = default_value.keydown;
        }
        return html`
            <div class="mdc-dialog__container">
                <div class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content">
                    ${when(this.title, () => html`<h2 class="mdc-dialog__title" id="my-dialog-title">${this.title}</h2>`)}
                    <div class="mdc-dialog__content" id="my-dialog-content">
                        <lm-text-field ${ref(this.domain_input)} label="도메인" default_value="${default_value.domain}"></lm-text-field><br>
                        <lm-text-field ${ref(this.gesture_input)} label="제스쳐" placeholder="[UDLR]+" shakeLabel></lm-text-field><br>
                        <lm-select ${ref(this.action_input)} label="액션" data="${JSON.stringify(this.actions.map((a) => {return {value: a, label: translate(a)}}))}" default_value=""></lm-select><br>
                        <lm-text-field ${ref(this.keydown_input)} label="키 입력" placeholder="키 조합을 누르세요"></lm-text-field><br>
                    </div>
                    <div class="mdc-dialog__actions">
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close"
                            @click="${() => init_values()}">
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">취소</span>
                        </button>
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept"
                            @click="${() => {
                                this.onaccept({
                                    domain: this.domain_input.value.value,
                                    gesture: this.gesture_input.value.value,
                                    action: this.action_input.value.value,
                                    action_details: this.keydown_input.value.value,
                                });
                                init_values();
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
    }
    firstUpdated () {
        this.dialog = new MDCDialog(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('rule-dialog', RuleDialog);
