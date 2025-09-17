import { LitElement, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { choose } from 'lit/directives/choose.js';

import { translate } from '@common/translate';
import { option_categories } from '@common/default_options';

export class MainContentAbout extends LitElement {
    constructor () {
        super();
        this.id = 'main-content-about';
        this.page = 'about';
        this.version = chrome.runtime.getManifest().version;
    }
    render () {
        const createVersion = (group) => html`<span>${translate(group)} ${this.version}</span>`;
        const createLink = (group, link) => html`<a href='${link}' target='_blank'>${translate(group)}</a>`;
        return html`
            <div class="mdc-layout-grid">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell">
                        <h1 class="mdc-typography mdc-typography--headline5">${translate(this.page)}</h1>
                    </div>
                </div>
                ${map(option_categories[2].groups, ({group, type, link}) => html`
                        <label class="number mdc-layout-grid__inner mdc-layout-grid--align-middle">
                            <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-middle">
                                ${choose(type, [
                                    ['version', () => createVersion(group)],
                                    ['link', () => createLink(group, link)],
                                ])}
                            </div>
                        </label>
                `)}
            </div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-about', MainContentAbout);
