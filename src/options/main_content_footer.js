import { LitElement, html } from 'lit';

import { store } from '@common/store';

export class MainContentFooter extends LitElement {
    onClickReset () {
        store.reset();
        store.sync();
    }
    render () {
        return html`
            <hr class="divider">
            <div id="footer">
                <button id="update" @click="">변경사항 저장</button>
                <button id="cancle" @click="">취소</button>
                <button id="reset" @click="${this.onClickReset}">기본 설정 불러오기</button>
            </div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-footer', MainContentFooter);
