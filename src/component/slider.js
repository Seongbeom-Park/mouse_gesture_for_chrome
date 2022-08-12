import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { MDCSlider } from '@material/slider';

export class Slider extends LitElement {
    static properties = {
        min: {type: Number},
        max: {type: Number},
        value: {type: Number},
        step: {type: Number},
        onchange: {type: Object},
    }
    get disabled () {
        return this.slider.getDisabled();
    }
    set disabled (value) {
        this.slider.setDisabled(value);
    }
    setValue (value) {
        this.slider.setValue(value);
    }
    render () {
        this.slider = createRef();
        return html`
            <div ${ref(this.slider)} class="mdc-slider mdc-slider--discrete">
                <input class="mdc-slider__input" type="range"
                    min="${ifDefined(this.min)}" max="${ifDefined(this.max)}" value="${ifDefined(this.value)}" step="${ifDefined(this.step)}"
                    name="volume"
                    aria-label="Discrete slider demo">
                <div class="mdc-slider__track">
                    <div class="mdc-slider__track--inactive"></div>
                    <div class="mdc-slider__track--active">
                        <div class="mdc-slider__track--active_fill"></div>
                    </div>
                </div>
                <div class="mdc-slider__thumb">
                    <div class="mdc-slider__value-indicator-container" aria-hidden="true">
                    <div class="mdc-slider__value-indicator">
                        <span class="mdc-slider__value-indicator-text"></span>
                    </div>
                    </div>
                    <div class="mdc-slider__thumb-knob"></div>
                </div>
            </div>
        `;
    }
    connectedCallback () {
        super.connectedCallback();
        (async () => {
            await this.updateComplete;
            this.slider.layout();
        })();
    }
    firstUpdated () {
        this.slider = new MDCSlider(this.slider.value);
        if (this.onchange) this.slider.listen('MDCSlider:change', (e) => this.onchange(e));
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('lm-slider', Slider);
