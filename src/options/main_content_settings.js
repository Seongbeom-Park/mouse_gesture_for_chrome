import { LitElement, html } from 'lit';

import '@options/main_content_footer';

export class MainContentSettings extends LitElement {
    render () {
        return html`
            <label class="number">
                <h2>threshold angle</h2>
                <input type="number" id="threshold_angle" min="0" max="90" />°
            </label><br>

            <label class="number">
                <h2>sampling period</h2>
                <input type="number" id="sampling_period" min="1" />
            </label><br>

            <label class="number">
                <h2>page up/down scroll factor</h2>
                <input type="number" id="scroll_factor" min="0" />
            </label><br>

            <label class="number">
                <h2>drag tracking activation</h2>
                <input type="checkbox" id="use_draw_line">
            </label>

            <label class="number">
                <h2>action preview activation</h2>
                <input type="checkbox" id="use_action_preview">
            </label>

            <label class="number">
                <h2>action preview text x offset from mouse curser</h2>
                <input type="number" id="action_preview_x_offset">
            </label>

            <label class="number">
                <h2>action preview text y offset from mouse curser</h2>
                <input type="number" id="action_preview_y_offset">
            </label>
            <main-content-footer page="${this.page}"></main-content-footer>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-settings', MainContentSettings);
