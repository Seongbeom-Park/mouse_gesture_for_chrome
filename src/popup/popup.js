import '@options/styles/options.scss';

import { LitElement, html } from 'lit';

import { store } from '@common/store';
import { translate } from '@common/translate';
import { RuleDialog } from '@options/rule_dialog';

class Popup extends LitElement {
    render () {
        this.rule_dialog = new RuleDialog();
        this.rule_dialog.classList.add('mdc-dialog--open');
        this.rule_dialog.classList.add('mdc-dialog--fullscreen');
        this.rule_dialog.title = '현재 도메인 이름으로 규칙 추가하기';
        this.rule_dialog.actions = [
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
        this.rule_dialog.default_values = {
            domain: '*',
            gesture: '',
            action: '',
            keydown: '',
        }
        this.rule_dialog.disable_domain = true;
        this.rule_dialog.onaccept = ({domain, gesture, action, action_details}) => {
            store.addRule(domain, gesture, action, action_details);
            store.sync();
            window.close();
        }

        const openOptions = () => chrome.runtime.openOptionsPage();

        return html`
            ${this.rule_dialog}
        `;
    }
    firstUpdated () {
        const getActiveTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);
        getActiveTab().then((tab) => {
            const url = new URL(tab.url)
            
            this.rule_dialog.default_values = {
                domain: url.hostname,
                gesture: '',
                action: '',
                keydown: '',
            }
        });
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('popup-elem', Popup);
