import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MDCSwitch } from '@material/switch';

export class Switch extends LitElement {
    static properties = {
        value: {type: Boolean},
    }
    constructor () {
        super();
        this.dependency_tree = [];
    }
    get selected () {
        return this.switch?.selected ?? this.value;
    }
    set selected (value) {
        this.switch.selected = value;
        this.setChildrenDisabled();
    }
    get disabled () {
        return this.switch.disabled;
    }
    set disabled (value) {
        this.switch.disabled = value;
    }
    addChild (child) {
        this.dependency_tree.push(child);
    }
    setChildrenDisabled () {
        (async () => {
            for (const child of this.dependency_tree) {
                await child.updateComplete;
                child.disabled = !this.selected;
            }
        })();
    }
    render () {
        this.switch = createRef();
        return html`
            <button ${ref(this.switch)} class="mdc-switch ${when(this.value, () => 'mdc-switch--selected', () => 'mdc-switch--unselected')}"
                type="button" role="switch" aria-checked="${this.value}">
                <div class="mdc-switch__track"></div>
                <div class="mdc-switch__handle-track">
                    <div class="mdc-switch__handle">
                        <div class="mdc-switch__shadow">
                            <div class="mdc-elevation-overlay"></div>
                        </div>
                        <div class="mdc-switch__ripple"></div>
                        <div class="mdc-switch__icons">
                            <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
                                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
                            </svg>
                            <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
                                <path d="M20 13H4v-2h16v2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </button>
            <label for="basic-switch">off/on</label>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        this.setChildrenDisabled();
    }
    firstUpdated () {
        this.switch = new MDCSwitch(this.switch.value);
        this.switch.selected = this.value;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-switch', Switch);
