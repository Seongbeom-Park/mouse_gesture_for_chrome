import '@options/styles/options.scss';

import { LitElement, html } from 'lit';

import { store } from '@common/store';
import { action_list } from '@content_scripts/actions';
import { RuleDialog } from '@options/rule_dialog';

class Popup extends LitElement {
    render () {
        const rule_dialog = new RuleDialog();
        rule_dialog.fullscreen = true;
        rule_dialog.classList.add('mdc-dialog--open');
        rule_dialog.title = '현재 도메인 이름으로 규칙 추가하기';
        rule_dialog.actions = action_list;
        rule_dialog.default_values = {
            domain: '*',
            gesture: '',
            action: '',
            keydown: '',
            url: '',
        }
        rule_dialog.disable_domain = true;
        rule_dialog.onaccept = ({domain, gesture, action, action_details}) => {
            store.addRule(domain, gesture, action, action_details);
            store.sync();
            window.close();
        }

        rule_dialog.onClose = () => window.close();
        rule_dialog.onOpenOptions = () => chrome.runtime.openOptionsPage();

        const getCurrentTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);
        getCurrentTab().then((tab) => {
            const url = new URL(tab.url)
            
            rule_dialog.default_values = {
                domain: url.hostname,
                gesture: '',
                action: '',
                keydown: '',
                url: '',
            }
        });

        return html`
            ${rule_dialog}
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('popup-elem', Popup);
