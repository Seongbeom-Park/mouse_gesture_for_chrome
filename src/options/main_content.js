import { LitElement, html } from 'lit';

import '@options/main_content_rules';
import { MainContentSettings } from '@options/main_content_settings';

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
    route () {
        switch (this.page) {
            case 'rules':
                return html`<main-content-rules></main-content-rules>`;
            case 'settings':
                return new MainContentSettings();
            default:
                return new MainContentNotFound();
        }
    }
    render () {
        return html`
            <main class="main-content">${this.route()}</main><my-element></my-element>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content', MainContentRouter);
customElements.define('main-content-not-found', MainContentNotFound);
