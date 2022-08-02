import { LitElement, html } from 'lit';

import { store } from '@common/store';

import '@options/main_content_footer';
import '@component/data_table';
import '@component/dialog';
import '@component/button';
import '@component/select';
import { TextField } from '@component/text_field';

export class MainContentRules extends LitElement {
    static properties = {
        columns: {type: Object},
        contents: {type: Object},
    }
    constructor () {
        super();
        this.id = 'main-content-rules';
        this.page = 'rules';
        this.columns = ['domain', 'gesture', 'action', 'action_details'];
        this.contents = {};
    }
    flatContents () {
        const parseKeyboardEvent = (keyboard_event) => {
            if (!keyboard_event) return keyboard_event;

            const {ctrlKey, altKey, shiftKey, key, code} = keyboard_event;
            var value = '';
            if (ctrlKey) value += 'Ctrl + ';
            if (shiftKey) value += 'Shift + ';
            if (altKey) value += 'Alt + ';
            if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
            if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

            return value;
        }

        return Object.entries(this.contents).flatMap(([domain, gestures]) => Object.entries(gestures).map(([gesture, {action, action_details}]) => [domain, gesture, action, parseKeyboardEvent(action_details)]));
    }
    render () {
        const translate = (text) => {
            switch (text) {
                case 'domain':
                    return '도메인';
                case 'gesture':
                    return '제스처';
                case 'action':
                    return '액션';
                case 'action_details':
                    return '세부항목';
                default:
                    return text;
            }
        }
        const data = [
            {
                value: 'closeTab',
                label: '창 닫기',
            },
            {
                value: 'goBack',
                label: '이전 페이지로',
            },
            {
                value: 'goBackOrCloseTab',
                label: '이전 페이지로 가거나 창 닫기',
            },
            {
                value: 'goForward',
                label: '다음 페이지로',
            },
            {
                value: 'scrollTop',
                label: '맨 위로',
            },
            {
                value: 'scrollBottom',
                label: '맨 아래로',
            },
            {
                value: 'pageDown',
                label: '페이지 업',
            },
            {
                value: 'pageUp',
                label: '페이지 다운',
            },
            {
                value: 'restore',
                label: '최근에 닫힌 탭 열기',
            },
            {
                value: 'keydown',
                label: '키보드 입력',
            },
            {
                value: 'reload',
                label: '새로고침',
            },
        ];

        return html`
            <header><h1>규칙</h1></header>
            <lm-button icon="add" value="새 규칙 추가" @click="${() => {document.getElementById('new_rule_dialog').open()}}"></lm-button>
            <lm-button icon="delete" value="선택 항목 삭제" @click="${() => {}}"></lm-button>
            <lm-data-table id="rules_table" columns="${JSON.stringify(this.columns.map(translate))}" contents="${JSON.stringify(this.flatContents())}" style="width: 100%;" create_checkbox></lm-data-table>
            <main-content-footer page="${this.page}"></main-content-footer>
            <form id="gestures">
                <h2>rules</h2>
                <div id="rule_template">
                    <input name="domain" type="url" value="*" autocomplete="off" >
                    <input name="gesture" pattern="[UDLR]+" placeholder="[UDLR]+" >
                    <select name="action" >
                        <option value="undefined">select action</option>
                        <option value="closeTab">closeTab</option>
                        <option value="goBack">goBack</option>
                        <option value="goBackOrCloseTab">goBackOrCloseTab</option>
                        <option value="goForward">goForward</option>
                        <option value="scrollTop">scrollTop</option>
                        <option value="scrollBottom">scrollBottom</option>
                        <option value="pageDown">pageDown</option>
                        <option value="pageUp">pageUp</option>
                        <option value="restore">restore</option>
                        <option value="keydown">keydown</option>
                        <option value="reload">reload</option>
                        <option value="nothing">nothing</option>
                    </select>
                    <input name="keydown" value="" autocomplete="off" />
                    <button type="button" name="remove" >-</button>
                    <br>
                </div>
            </form>
            <button id="add_gesture">+</button><br>
            <main-content-footer></main-content-footer>
            <lm-dialog id="new_rule_dialog"></lm-dialog>

            <lm-text-field label="도메인"></lm-text-field>
            <lm-text-field label="제스쳐"></lm-text-field>
            <lm-select label="액션" data="${JSON.stringify(data)}" default_value=""></lm-select>
            <lm-text-field label="키 입력"></lm-text-field>
        `;
    }
    firstUpdated () {
        this.contents = store.domains;
    }
    connectedCallback () {
        super.connectedCallback();
        this.update_contents_callback_id = store.addOnChangedListener(({domains}) => {
            this.contents = domains;
        });
    }
    disconnectedCallback () {
        super.disconnectedCallback();
        store.removeOnChangedListener(this.update_contents_callback_id);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-rules', MainContentRules);
