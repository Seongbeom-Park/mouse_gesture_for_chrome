import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { MDCTopAppBar } from '@material/top-app-bar';

class TopAppBar extends LitElement {
    static properties = {
        title: {type: String, attribute: true},
    }
    render () {
        this.top_app_bar = createRef();
        return html`
            <header ${ref(this.top_app_bar)} class="mdc-top-app-bar mdc-top-app-bar--fixed">
                <div class="mdc-top-app-bar__row">
                    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                        <span class="mdc-top-app-bar__title">${this.title}</span>
                    </section>
                </div>
            </header>
        `;
    }
    firstUpdated () {
        this.top_app_bar = new MDCTopAppBar(this.top_app_bar.value);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('top-app-bar', TopAppBar);
