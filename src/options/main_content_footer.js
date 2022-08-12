import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';

import { store } from '@common/store';
import '@component/button';

export class MainContentFooter extends LitElement {
    static properties = {
        page: {type: String}
    }
    onClickSave () {
        store.sync();
    }
    onClickCancel () {
        store.revert(this.page);
    }
    onClickReset () {
        store.reset(this.page);
    }
    render () {
        this.save_button = createRef();
        return html`
            <hr class="divider">
            <div id="footer">
                <lm-button ${ref(this.save_button)} icon="save" value="변경사항 저장" @click="${this.onClickSave}"></lm-button>
                <lm-button icon="cancel" value="취소" @click="${this.onClickCancel}"></lm-button>
                <lm-button icon="restart_alt" value="기본 설정 불러오기" @click="${this.onClickReset}"></lm-button>
            </div>
        `;
    }
    highlightSaveButton = ({target}) => {
        if (target.changed) this.save_button.value.emphasis = 'high';
        else this.save_button.value.emphasis = 'medium';
    }
    connectedCallback () {
        super.connectedCallback();
        store.addEventListener('Store:changed', this.highlightSaveButton);
    }
    disconnectedCallback () {
        super.disconnectedCallback();
        store.removeEventListener('Store:changed', this.highlightSaveButton);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-footer', MainContentFooter);
