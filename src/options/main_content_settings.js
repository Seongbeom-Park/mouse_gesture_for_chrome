import { LitElement, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { choose } from 'lit/directives/choose.js';
import { when } from 'lit/directives/when.js';

import { store } from '@common/store';
import { translate } from '@common/translate';
import { option_categories } from '@common/default_options';
import '@options/main_content_footer';
import { Slider } from '@component/slider';
import { Switch } from '@component/switch';
import { TextField } from '@component/text_field';
import { ColorBox } from '@component/color_box';

export class MainContentSettings extends LitElement {
    constructor () {
        super();
        this.page = 'settings';
        this.options = [];
        this.options_map = {};
    }
    render () {
        const createSection = ({ group, options }) => {
            return html`
                <hr class="divider">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell">
                        <h2 class="mdc-typography mdc-typography--headline6">${translate(group)}</h2>
                    </div>
                </div>
                ${map(options, ({ option, type, spec }) => html`
                    <label class="number mdc-layout-grid__inner mdc-layout-grid--align-middle">
                        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-middle">
                            <span>${translate(option)}</span>
                            ${when(spec?.unit, () => html`<span class="mdc-typography mdc-typography--body2">(단위: ${spec.unit})</span>`)}
                        </div>
                        ${choose(type, [
                            ['number', () => {
                                const slider = new Slider();
                                slider.classList.add('mdc-layout-grid__cell');
                                slider.id = option;
                                slider.min = spec.min;
                                slider.max = spec.max;
                                slider.step = spec?.step;
                                slider.value = store[option];
                                slider.onchange = (e) => store.set({[option]: e.detail.value});
                                if (spec?.dependency) {
                                    this.options_map[spec.dependency].addChild(slider);
                                }
                                store.addEventListener('Store:set', ({target}) => {
                                    slider.setValue(target[option]);
                                });
                                this.options.push(slider);
                                this.options_map[option] = slider;
                                return html`${slider}`;
                            }],
                            ['boolean', () => {
                                const toggle = new Switch();
                                toggle.classList.add('mdc-layout-grid__cell');
                                toggle.id = option;
                                toggle.value = store[option];
                                toggle.onclick = () => store.set({[option]: toggle.selected});
                                store.addEventListener('Store:set', ({target}) => {
                                    toggle.selected = target[option];
                                });
                                this.options.push(toggle);
                                this.options_map[option] = toggle;
                                return html`${toggle}`;
                            }],
                            ['color', () => { // text + color box
                                const text_field = new TextField();
                                const color_box = new ColorBox();

                                text_field.classList.add('mdc-layout-grid__cell');
                                text_field.id = option;
                                text_field.label = translate('color_code');
                                text_field.placeholder = '#RRGGBB or #RRGGBBAA'
                                text_field.required = true;
                                text_field.pattern = '#([0-9A-Fa-f]{6})|#([0-9A-Fa-f]{8})';
                                text_field.default_value = store[option];
                                text_field.onchange = (e) => {
                                    if (e.target.validity.valid) {
                                        store.set({[option]: e.target.value});
                                        color_box.container_color = e.target.value;
                                    }
                                }
                                store.addEventListener('Store:set', ({target}) => {
                                    text_field.value = target[option];
                                    color_box.container_color = target[option];
                                });
                                this.options.push(text_field);
                                this.options_map[option] = text_field;

                                color_box.classList.add('mdc-layout-grid__cell');
                                color_box.id = 'color_box-' + option;
                                color_box.container_color = store[option];
                                return html`${text_field}${color_box}`;
                            }],
                        ])}
                    </label>
                `)}
            `;
        }

        return html`
            <div class="mdc-layout-grid">
                <div class="mdc-layout-grid__inner">
                    <div class="mdc-layout-grid__cell">
                        <h1 class="mdc-typography mdc-typography--headline5">${translate(this.page)}</h1>
                    </div>
                </div>
                ${map(option_categories[1].groups, (group) => createSection(group))}
            </div>
            <main-content-footer page="settings"></main-content-footer>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('main-content-settings', MainContentSettings);
