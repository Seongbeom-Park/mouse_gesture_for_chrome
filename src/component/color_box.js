import { LitElement, html } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MDCRipple } from '@material/ripple';

export class ColorBox extends LitElement {
    static properties = {
        container_color: {type: String},
    }
    render () {
        this.color_box = createRef();
        return html`
            <div ${ref(this.color_box)} class="">
                <button
                    class="mdc-fab mdc-fab--mini"
                    style="
                        ${when(this.container_color, () => "background-color: " + this.container_color + "; ")}
                    "
                >
                    <div class="mdc-fab__ripple"></div>
                </button>
            </div>
        `;
    }
    firstUpdated () {
        this.color_box = new MDCRipple(this);
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-color-box', ColorBox);
