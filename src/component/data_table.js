import { LitElement, html, unsafeCSS } from "lit";

import '@component/checkbox';

class DataTable extends LitElement {
    static properties = {
        columns: {type: Object},
        contents: {type: Object},
        create_checkbox: {type:Boolean},
    }
    constructor () {
        super();
        this.classList.add('mdc-data-table');
        this.columns = [];
        this.contents = [];
    }
    createHeader () {
        const createHeaderCheckbox = () => {
            if (this.create_checkbox) {
                return html`
                    <th class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                        <lm-checkbox class="mdc-data-table__header-row-checkbox mdc-checkbox--selected" aria_label="Toggle all rows"></lm-checkbox>
                    </th>
                `;
            }
        }

        const createHeaderCell = (columns) => {
            return columns.map((column) => html`
                <th class="mdc-data-table__header-cell" role="columnheader" scope="col">${column}</th>
            `);
        }

        return html`
            <thead>
                <tr class="mdc-data-table__header-row">
                    ${createHeaderCheckbox()}
                    ${createHeaderCell(this.columns)}
                </tr>
            </thead>
        `;
    }
    createBody () {
        const createBodyCheckbox = (id, selected) => {
            if (this.create_checkbox) {
                if (selected) {
                    return html`
                        <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                            <lm-checkbox class="mdc-data-table__row-checkbox" labelledby="${unsafeCSS(id)}" checked ></lm-checkbox>
                        </td>
                    `;
                } else {
                    return html`
                        <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                            <lm-checkbox class="mdc-data-table__row-checkbox" labelledby="${unsafeCSS(id)}"></lm-checkbox>
                        </td>
                    `;
                }
            }
        }

        const createBodyCell = (is_first, id, value) => {
            if (is_first) return html`<th class="mdc-data-table__cell" scope="row" id="${unsafeCSS(id)}">${value}</th>`;
            else return html`<td class="mdc-data-table__cell">${value}</td>`;
        }

        const createBodyRow = (id, data, selected = false) => {
            return html`
                <tr data-row-id="${unsafeCSS(id)}" class="mdc-data-table__row ${selected && 'mdc-data-table__row--selected'}" ${selected && 'aria-selected="true"'} >
                    ${createBodyCheckbox(id, selected)}
                    ${data.map((value, index) => createBodyCell(index === 0, id, value))}
                </tr>
            `;
        }

        return html`
            <tbody class="mdc-data-table__content">
                ${this.contents.map((content, index) => createBodyRow('u' + index, content))}
            </tbody>
        `;
    }
    render () {
        const aria_label = this.ariaLabel ?? "Data Table";
        return html`
            <div class="mdc-data-table__table-container">
                <table class="mdc-data-table__table" aria-label="${aria_label}">
                    ${this.createHeader()}
                    ${this.createBody()}
                </table>
            </div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-data-table', DataTable);
