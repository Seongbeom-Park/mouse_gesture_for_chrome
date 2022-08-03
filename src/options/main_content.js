import { LitElement, html } from 'lit';
import {choose} from 'lit/directives/choose.js';

import '@options/main_content_rules';
import '@options/main_content_settings';

class MainContentNotFound extends LitElement {
    render () {
        return html`
            <span>404 Error. Page Not Found</span>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

class MainContentRouter extends LitElement {
    static properties = {
        page: {type: String},
    }
    render () {
        return html`
            <main class="main-content">
                ${choose(this.page, [
                    ['rules', () => html`<main-content-rules></main-content-rules>`],
                    ['settings', () => html`<main-content-settings></main-content-settings>`],
                ],
                () => html`<main-content-not-found></main-content-not-found>`)}
            </main>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content', MainContentRouter);
customElements.define('main-content-not-found', MainContentNotFound);
