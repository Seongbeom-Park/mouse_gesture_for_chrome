import '@options/styles/options.scss';

import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';

import { store } from '@common/store';
import { translate } from '@common/translate';
import '@component/text_field';
import '@component/select';
import '@component/button';

class Popup extends LitElement {
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

        const title = '규칙 추가하기/수정하기';
        const actions = [
            'closeTab',
            'goBack',
            'goBackOrCloseTab',
            'goForward',
            'scrollTop',
            'scrollBottom',
            'pageDown',
            'pageUp',
            'restore',
            'keydown',
            'reload',
            'nothing',
        ];
        const default_values = {
            domain: '*',
            gesture: '',
            action: '',
            keydown: '',
        }
        const onaccept = ({domain, gesture, action, action_details}) => store.addRule(domain, gesture, action, action_details);

        const openOptions = () => chrome.runtime.openOptionsPage();
        return html`
            <div class="mdc-layout-grid">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <lm-text-field ${ref(this.domain_input)}
                            class="dialog_input"
                            label="도메인"
                            default_value="${default_values.domain}"
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
                            data="${JSON.stringify(actions.map((a) => {return {value: a, label: translate(a)}}))}"
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
                            pattern="(Ctrl + )?(Shift + )?(Alt + )?'[A-Z]'"
                            required
                            hidden
                            ></lm-text-field>
                    </div>
                </div>
            </div>
            <lm-button icon="add" value="${translate('add_edit_rule')}" @click="${onaccept}"></lm-button>
            <lm-button icon="settings" value="${translate('open_options')}" @click="${openOptions}"></lm-button>
        `;
    }
    firstUpdated () {
        const getActiveTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('popup-elem', Popup);
