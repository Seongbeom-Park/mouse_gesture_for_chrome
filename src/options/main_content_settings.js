import { LitElement, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';

import { store } from '@common/store';
import { translate } from '@common/translate';
import { option_categories } from '@common/default_options';
import '@options/main_content_footer';
import { Slider } from '@component/slider';

export class MainContentSettings extends LitElement {
    constructor () {
        super();
        this.page = 'settings';
    }
    render () {
        const createSection = ({ group, options }) => {
            return html`
                <section>
                    <div>
                        <h2>${translate(group)}</h2>
                    </div>
                    <div>
                        ${map(options, ({ option, type, spec }) => html`
                            <label class="number">
                                <span>${translate(option)}</span>
                                ${when(spec?.unit, () => html`<span>(단위: ${spec.unit})</span>`)}
                                ${choose(type, [
                                    ['number', () => {
                                        const slider = new Slider();
                                        slider.min = spec.min;
                                        slider.max = spec.max;
                                        slider.step = spec?.step;
                                        slider.value = store[option];
                                        slider.onchange = (e) => store.set({[option]: e.detail.value});
                                        store.addEventListener('Store:set', ({target}) => slider.setValue(target[option]));
                                        return html`${slider}`
                                        }
                                    ],
                                    ['boolean', () => html`switch placeholder`],
                                ])}
                            </label><br>
                        `)}
                    </div>
                </section>
                <br>
            `;
        }

        return html`
            <header><h1>${translate(this.page)}</h1></header>
            ${map(option_categories[1].groups, (group) => createSection(group))}

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
            <main-content-footer page="settings"></main-content-footer>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-settings', MainContentSettings);
