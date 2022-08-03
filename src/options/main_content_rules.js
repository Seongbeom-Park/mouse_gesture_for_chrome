import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';

import { store } from '@common/store';
import { translate } from '@common/translate';
import '@options/main_content_footer';
import { DataTable } from '@component/data_table';
import '@component/dialog';
import '@component/button';
import '@component/select';
import '@component/text_field';

export class MainContentRules extends LitElement {
    static properties = {
        columns: {type: Object},
        contents: {type: Object},
    }
    constructor () {
        super();
        this.id = 'main-content-rules';
        this.page = 'rules';
        this.columns = ['domain', 'gesture', 'action', 'action_details', 'edit'];
        this.actions = [
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
        ];
    }
    
    flatContents (contents) {
        const parseKeyboardEvent = (keyboard_event) => {
            if (!keyboard_event) return '';

            const {ctrlKey, altKey, shiftKey, key, code} = keyboard_event;
            var value = '';
            if (ctrlKey) value += 'Ctrl + ';
            if (shiftKey) value += 'Shift + ';
            if (altKey) value += 'Alt + ';
            if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
            if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

            return value;
        }

        return Object.entries(contents).flatMap(([domain, gestures]) => {
            return Object.entries(gestures).map(([gesture, {action, action_details}]) => {
                return [
                    domain,
                    gesture,
                    translate(action),
                    parseKeyboardEvent(action_details),
                    '<i class="material-icons">edit</i>',
                ];
            })
        });
    }

    render () {
        this.rule_table = new DataTable(this.columns.map(translate), this.flatContents(store.domains));
        this.rule_table.id = 'rule_table';


        const addNewRule = (domain, gesture, action, action_details) => {
            store.addRule(domain, gesture, action, action_details);
        }

        const removeSelectedRules = () => {
            const ids = this.rule_table.data_table.getSelectedRowIds();
            for (const id of ids) {
                const [domain, gesture] = this.rule_table.rows[id];
                store.removeRule(domain, gesture);
            }
            this.rule_table.data_table.setSelectedRowIds([]);
        }

        const rule_dialog_ref = createRef();

        const openNewRuleDialog = () => {
            rule_dialog_ref?.value?.open();
        }

        return html`
            <header><h1>규칙</h1></header>
            <lm-button icon="add" value="새 규칙 추가" @click="${openNewRuleDialog}"></lm-button>
            <lm-button icon="delete" value="선택 항목 삭제" @click="${removeSelectedRules}"></lm-button>
            <br>
            ${this.rule_table}
            <main-content-footer page="${this.page}"></main-content-footer>

            <lm-dialog ${ref(rule_dialog_ref)} class="unselectable" title="새 규칙 추가하기">
                <lm-text-field label="도메인" default_value="*"></lm-text-field><br>
                <lm-text-field label="제스쳐" placeholder="[UDLR]+"></lm-text-field><br>
                <lm-select label="액션" data="${JSON.stringify(this.actions.map((a) => {return {value: a, label: translate(a)}}))}" default_value=""></lm-select><br>
                <lm-text-field label="키 입력" placeholder="키 조합을 누르세요"></lm-text-field><br>
            </lm-dialog>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        this.update_contents_callback = ({target}) => {
            this.rule_table.contents = this.flatContents(target.domains);
        };
        store.addEventListener('Store:set', this.update_contents_callback);
    }
    disconnectedCallback () {
        super.disconnectedCallback();
        store.removeEventListener('Store:set', this.update_contents_callback);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-rules', MainContentRules);
