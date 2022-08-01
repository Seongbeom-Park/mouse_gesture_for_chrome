import { LitElement, html } from 'lit';

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
    createRenderRoot () {
        return this;
    }
}

customElements.define('top-app-bar', TopAppBar);
