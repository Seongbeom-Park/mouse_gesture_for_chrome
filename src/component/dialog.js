import { LitElement, html } from 'lit';
import { MDCDialog } from '@material/dialog';

class Dialog extends LitElement {
    constructor () {
        super();
        this.classList.add('mdc-dialog');
    }
    open () {
        this.dialog.open();
    }
    render () {
        return html`
            <div class="mdc-dialog__container">
                <div class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content">
                    <h2 class="mdc-dialog__title" id="my-dialog-title">새 규칙 추가</h2>
                    <div class="mdc-dialog__content" id="my-dialog-content">
                        <ul class="mdc-list">
                            <li class="mdc-list-item" tabindex="0">
                                <span class="mdc-list-item__graphic">
                                    <div class="mdc-radio">
                                        <input class="mdc-radio__native-control"
                                            type="radio"
                                            id="test-dialog-baseline-confirmation-radio-1"
                                            name="test-dialog-baseline-confirmation-radio-group"
                                            checked>
                                        <div class="mdc-radio__background">
                                            <div class="mdc-radio__outer-circle"></div>
                                            <div class="mdc-radio__inner-circle"></div>
                                        </div>
                                    </div>
                                </span>
                                <label id="test-dialog-baseline-confirmation-radio-1-label"
                                    for="test-dialog-baseline-confirmation-radio-1"
                                    class="mdc-list-item__text">None</label>
                            </li>
                        </ul>
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
    firstUpdated () {
        this.dialog = new MDCDialog(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-dialog', Dialog);
