import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';
import { map } from 'lit/directives/map.js';
import { MDCDataTable } from '@material/data-table';

export class DataTable extends LitElement {
    static properties = {
        columns: {type: Object},
        contents: {type: Object},
    }
    constructor (columns = [], contents = []) {
        super();
        this.columns = columns;
        this.contents = contents;
        this.rows = {};
    }
    render () {
        const createCheckbox = (position, id) => {
            const createContents = ({ class_list, aria_label, aria_labelledby }) => {
                return html`
                    <div class="mdc-checkbox ${class_list.join(' ')}">
                        <input type="checkbox" class="mdc-checkbox__native-control" aria-label=${ifDefined(aria_label)} aria-labelledby=${ifDefined(aria_labelledby)}/>
                        <div class="mdc-checkbox__background">
                            <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                            </svg>
                            <div class="mdc-checkbox__mixedmark"></div>
                        </div>
                        <div class="mdc-checkbox__ripple"></div>
                    </div>
                `;
            }
    
            return html`
                ${choose(position, [
                    ['header', () => html`
                        <th class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                            ${createContents({
                                class_list: ["mdc-data-table__header-row-checkbox", "mdc-checkbox--selected"],
                                aria_label: "Toggle all rows",
                            })}
                        </th>
                    `],
                    ['body', () => html`
                        <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                            ${createContents({
                                class_list: ["mdc-data-table__row-checkbox"],
                                aria_labelledby: id
                            })}
                        </td>
                    `],
                ])}
            `;
        }

        const createHeader = () => {
            const createHeaderCell = (column) => html`<th class="mdc-data-table__header-cell" role="columnheader" scope="col">${column}</th>`;
    
            return html`
                <thead>
                    <tr class="mdc-data-table__header-row">
                        ${createCheckbox('header')}
                        ${map(this.columns, createHeaderCell)}
                    </tr>
                </thead>
            `;
        }
        
        const createBody = () => {
            const createBodyCell = ({scope, id, value}) => {
                return html`
                    <th class="mdc-data-table__cell" scope=${ifDefined(scope)} id=${ifDefined(id)}>
                        ${when(typeof(value) === 'string', () => unsafeHTML(value), () => value)}
                    </th>
                `;
            }

            const createBodyRow = (id, data) => {
                this.rows[id] = data;
                return html`
                    <tr data-row-id=${id} class="mdc-data-table__row" >
                        ${createCheckbox('body', id)}
                        ${map(data, (value, index) => createBodyCell(index === 0 ? {scope: 'row', id, value} : {value}))}
                    </tr>
                `;
            }

            return html`
                <tbody class="mdc-data-table__content">
                    ${map(this.contents, (content, index) => createBodyRow(`${this.id}_row_${index}`, content))}
                </tbody>
            `;
        }

        return html`
            <div class="mdc-data-table__table-container">
                <table class="mdc-data-table__table" aria-label="${this.ariaLabel ?? "Data Table"}">
                    ${createHeader()}
                    ${createBody()}
                </table>
            </div>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        this.classList.add('mdc-data-table');
    }
    firstUpdated () {
        this.data_table = new MDCDataTable(this);
    }
    updated () {
        this.data_table.layout();
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-data-table', DataTable);
