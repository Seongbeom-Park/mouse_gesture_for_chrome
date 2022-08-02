import { LitElement, html } from 'lit';
import { MDCTopAppBar } from '@material/top-app-bar';

class TopAppBar extends LitElement {
    static properties = {
        title: {type: String, attribute: true},
    }
    render () {
        return html`
            <header class="mdc-top-app-bar">
                <div class="mdc-top-app-bar__row">
                    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                        <span class="mdc-top-app-bar__title">${this.title}</span>
                    </section>
                </div>
            </header>
        `;
    }
    firstUpdated () {
        this.classList.add('mdc-top-app-bar');
        this.top_app_bar = new MDCTopAppBar(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('top-app-bar', TopAppBar);
