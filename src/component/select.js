import { LitElement, html } from 'lit';
import { MDCSelect } from '@material/select';

class Select extends LitElement {
    static properties = {
        label: {type: String},
        data: {type: Object},
        default_value: {type: String},
    }
    constructor () {
        super();
        this.classList.add('mdc-select');
        this.classList.add('mdc-select--outlined');
        this.data = [];
    }
    render () {
        const createListItem = (value, label) => {
            return html`
                <li class="mdc-list-item unselectable" data-value=${value} role="option">
                    <span class="mdc-list-item__ripple"></span>
                    ${label && html`<span class="mdc-list-item__text">${label}</span>`}
                </li>
            `;
        }

        return html`
            <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">
                <span class="mdc-notched-outline">
                    <span class="mdc-notched-outline__leading"></span>
                    <span class="mdc-notched-outline__notch">
                        ${this.label && html`<span class="mdc-floating-label">${this.label}</span>`}
                    </span>
                    <span class="mdc-notched-outline__trailing"></span>
                </span>
                <span class="mdc-select__selected-text-container">
                    <span class="mdc-select__selected-text"></span>
                </span>
                <span class="mdc-select__dropdown-icon mdc-select__dropdown-icon-graphic">
                    <i class="material-icons mdc-select__dropdown-icon-inactive unselectable">arrow_drop_down</i>
                    <i class="material-icons mdc-select__dropdown-icon-active unselectable">arrow_drop_up</i>
                </span>
            </div>
        
            <div class="mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth mdc-select__menu">
                <ul class="mdc-list" role="listbox">
                    ${this.data.map(({value, label}) => createListItem(value, label))}
                </ul>
            </div>
        `;
    }
    firstUpdated () {
        this.select = new MDCSelect(this);
        this.select.setValue(this.default_value);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-select', Select);
