import { LitElement, html, unsafeCSS } from 'lit';
import { MDCDataTable } from '@material/data-table';

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
    createCheckbox (position, id) {
        const createContents = ({ class_list, aria_label, aria_labelledby }) => {
            const _aria_label = aria_label ? `aria-label="${aria_label}"` : ``;
            const _aria_labelledby = aria_labelledby ? `aria-labelledby="${aria_labelledby}"` : ``;
            return html`
                <div class="mdc-checkbox ${unsafeCSS(class_list.join(' '))}">
                    <input type="checkbox" class="mdc-checkbox__native-control" ${unsafeCSS(_aria_label)} ${unsafeCSS(_aria_labelledby)}/>
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

        switch (position) {
            case 'header':
                return html`
                    <th class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                        ${createContents({
                            class_list: ["mdc-data-table__header-row-checkbox", "mdc-checkbox--selected"],
                            aria_label: "Toggle all rows",
                        })}
                    </th>
                `;
            case 'body':
                return html`
                    <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                        ${createContents({
                            class_list: ["mdc-data-table__row-checkbox"],
                            aria_labelledby: id
                        })}
                    </td>
                `;
        }
    }
    createHeader () {
        const createHeaderCell = (columns) => {
            return columns.map((column) => html`
                <th class="mdc-data-table__header-cell" role="columnheader" scope="col">${column}</th>
            `);
        }

        return html`
            <thead>
                <tr class="mdc-data-table__header-row">
                    ${this.createCheckbox('header')}
                    ${createHeaderCell(this.columns)}
                </tr>
            </thead>
        `;
    }
    createBody () {
        const createBodyCell = (is_first, id, value) => {
            if (is_first) return html`<th class="mdc-data-table__cell" scope="row" id="${unsafeCSS(id)}">${value}</th>`;
            else return html`<td class="mdc-data-table__cell">${value}</td>`;
        }

        const createBodyRow = (id, data) => {
            return html`
                <tr data-row-id="${unsafeCSS(id)}" class="mdc-data-table__row" >
                    ${this.createCheckbox('body', id)}
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
