import { LitElement, html } from 'lit';

import { store } from '@common/store';
import { translate } from '@common/translate';
import '@component/button';
import { DataTable } from '@component/data_table';
import '@component/icon_button';
import '@component/select';
import '@component/text_field';
import { action_list } from '@content_scripts/actions';
import '@options/main_content_footer';
import { RuleDialog } from '@options/rule_dialog';

export class MainContentRules extends LitElement {
    static properties = {
        columns: {type: Object},
        contents: {type: Object},
    }
    constructor () {
        super();
        this.page = 'rules';
        this.columns = ['domain', 'gesture', 'action', 'action_details'];
    }

    flatContents (contents) {
        const parseDetails = (action, details) => {
            switch (action) {
                case 'keydown':
                    return parseKeyboardEvent(details);
                case 'openTab':
                case 'openWindow':
                    return parseUrl(details);
                default:
                    return '';
            }
        }

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

        const parseUrl = (url) => {
            if (!url) return '';

            return url.url;
        }

        return Object.entries(contents).flatMap(([domain, gestures]) => {
            return Object.entries(gestures).map(([gesture, {action, action_details}]) => {
                return [
                    domain,
                    gesture,
                    translate(action),
                    parseDetails(action, action_details),
                ];
            })
        });
    }

    render () {
        this.rule_table = new DataTable(this.columns.map(translate), this.flatContents(store.domains));
        this.rule_table.id = 'rule_table';

        const removeSelectedRules = () => {
            const ids = this.rule_table.data_table.getSelectedRowIds();
            for (const id of ids) {
                const [domain, gesture] = this.rule_table.rows[id];
                store.removeRule(domain, gesture);
            }
            this.rule_table.data_table.setSelectedRowIds([]);
        }

        this.rule_dialog = new RuleDialog();
        this.rule_dialog.title = '규칙 추가하기/수정하기';
        this.rule_dialog.actions = action_list;
        this.rule_dialog.default_values = {
            domain: '*',
            gesture: '',
            action: '',
            keydown: '',
            url: '',
        }
        this.rule_dialog.onaccept = ({domain, gesture, action, action_details}) => store.addRule(domain, gesture, action, action_details);

        const openNewRuleDialog = () => {
            this.rule_dialog.open();
        }

        return html`
            <div class="mdc-layout-grid">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell">
                        <h1 class="mdc-typography mdc-typography--headline5">${translate(this.page)}</h1>
                    </div>
                </div>
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        <lm-button icon="add" value="규칙 추가/수정" @click="${openNewRuleDialog}"></lm-button>
                        ${this.rule_dialog}
                        <lm-button icon="delete" value="선택 항목 삭제" @click="${removeSelectedRules}"></lm-button>
                    </div>
                </div>
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
                        ${this.rule_table}
                    </div>
                </div>
            </div>
            <main-content-footer page="${this.page}"></main-content-footer>
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
