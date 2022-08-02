import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { MDCDialog } from '@material/dialog';

class Dialog extends LitElement {
    static properties = {
        title: {type: String},
    }
    open () {
        this.dialog.open();
    }
    render () {
        const slot = unsafeHTML(this.innerHTML);
        this.innerHTML = "";

        return html`
            <div class="mdc-dialog__container">
                <div class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content">
                    ${this.title ? html`<h2 class="mdc-dialog__title" id="my-dialog-title">${this.title}</h2>` : html``}
                    <div class="mdc-dialog__content" id="my-dialog-content">
                        ${slot}
                    </div>
                    <div class="mdc-dialog__actions">
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">취소</span>
                        </button>
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
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

customElements.define('lm-dialog', Dialog);
