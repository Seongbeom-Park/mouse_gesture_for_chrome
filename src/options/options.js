import { option_categories } from '@common/default_options';
import { store } from '@content_scripts/store';
import '@options/styles/options.scss';
import { LitElement, html } from 'lit';

window.onload = () => {
    const threshold_angle_form_element = document.getElementById('threshold_angle');
    const sampling_period_form_element = document.getElementById('sampling_period');
    const scroll_factor_form_element = document.getElementById('scroll_factor');
    const use_draw_line_form_element = document.getElementById('use_draw_line');
    const use_action_preview_form_element = document.getElementById('use_action_preview');
    const action_preview_x_offset_form_element = document.getElementById('action_preview_x_offset');
    const action_preview_y_offset_form_element = document.getElementById('action_preview_y_offset');
    const gestures_form_element = document.getElementById('gestures');
    const rule_template_element = document.getElementById('rule_template');
    const keydown_template_element = rule_template_element.querySelector('input[name=keydown]');

    const onSelectKeydownOption = (id, value) => {
        const rule_element = document.getElementById(id);
        const keydown_input_element = rule_element.querySelector('input[name=keydown]');
        switch (value) {
            case 'keydown':
                keydown_input_element.style.display = 'inline';
                break;
            default:
                keydown_input_element.style.display = 'none';
                break;
        }
    }

    const parseKeyboardEvent = ({ctrlKey, altKey, shiftKey, key, code}) => {
        var value = '';
        if (ctrlKey) value += 'Ctrl + ';
        if (shiftKey) value += 'Shift + ';
        if (altKey) value += 'Alt + ';
        if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
        if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

        return value;
    }

    const onKeydownEvent = (keydown_input_element, keyboard_event) => {
        keyboard_event.preventDefault();

        const {ctrlKey, altKey, shiftKey, key, code, keyCode} = keyboard_event;
        keydown_input_element.value = parseKeyboardEvent({ctrlKey, altKey, shiftKey, key, code});
        keydown_input_element.action_details = {ctrlKey, altKey, shiftKey, key, code, keyCode};
    }

    const updateActionDetails = (keydown_input_element, value) => {
        if (!/^(Ctrl \+ )?(Shift \+ )?(Alt \+ )?('[A-Z0-9]')?$/.test(value)) keydown_input_element.value = '';
    }

    var next_gesture_id = 0;
    const createGestureInput = (url = '*', gesture = '', action = 'undefined', action_details) => {
        const id = next_gesture_id;

        const rule_element = rule_template_element.cloneNode(true);
        rule_element.setAttribute('id', `rule_${id}`);
        rule_element.style.display = 'inline';

        const domain_input_element = rule_element.querySelector('input[name=domain]');
        domain_input_element.value = url;

        const gesture_input_element = rule_element.querySelector('input[name=gesture]');
        gesture_input_element.setAttribute('value', gesture);

        const action_input_element = rule_element.querySelector('select[name=action]');
        action_input_element.querySelector(`option[value=${action}]`).setAttribute('selected', true);
        action_input_element.onchange = (event) => onSelectKeydownOption(event.path[1].id, event.target.value);

        const keydown_input_element = rule_element.querySelector('input[name=keydown]');
        keydown_input_element.onkeydown = (event) => onKeydownEvent(keydown_input_element, event);
        keydown_input_element.onchange = (event) => updateActionDetails(keydown_input_element, event.value);
        if (action === 'keydown') {
            keydown_input_element.value = parseKeyboardEvent(action_details);
            keydown_input_element.action_details = action_details;
            keydown_input_element.style.display = 'inline';
        }

        const remove_button_element = rule_element.querySelector('button[name=remove]');
        remove_button_element.onclick = removeGestureInput(id);

        gestures_form_element.appendChild(rule_element);

        next_gesture_id += 1;
    }

    const addGestureInput = () => {
        return () => {
            createGestureInput();
        }
    }

    const removeGestureInput = (id) => {
        return () => {
            document.getElementById(`rule_${id}`).remove();
        };
    }

    const saveOptions = () => {
        const options = {}

        const rules = getUpdatedRules();
        if (rules){
            options['domains'] = rules;
        }
        const threshold_angle = threshold_angle_form_element.value;
        if (threshold_angle){
            options['threshold_angle'] = threshold_angle;
        }
        const sampling_period = sampling_period_form_element.value;
        if (sampling_period){
            options['sampling_period'] = sampling_period;
        }
        const scroll_factor = scroll_factor_form_element.value;
        if (scroll_factor){
            options['scroll_factor'] = scroll_factor;
        }
        options['use_draw_line'] = use_draw_line_form_element.checked;
        options['use_action_preview'] = use_action_preview_form_element.checked;
        const action_preview_x_offset = Number(action_preview_x_offset_form_element.value);
        if (action_preview_x_offset) {
            options['action_preview_x_offset'] = action_preview_x_offset;
        }
        const action_preview_y_offset = Number(action_preview_y_offset_form_element.value);
        if (action_preview_y_offset) {
            options['action_preview_y_offset'] = action_preview_y_offset;
        }

        store.set(options);
    }

    const getUpdatedRules = () => {
        const insain_rule_ids = [];
        const domains = {}
        for (var id = 0; id < next_gesture_id; id++) {
            const rule_element = gestures_form_element.querySelector(`#rule_${id}`)
            if (!rule_element) continue;

            const domain = rule_element.querySelector('input[name=domain]')?.value;
            const gesture = rule_element.querySelector('input[name=gesture]')?.value;
            const action = rule_element.querySelector('select[name=action]')?.value;
            const action_details = rule_element.querySelector('input[name=keydown]')?.action_details;
            if (!(domain in domains)) domains[domain] = {};
            if (gesture in domains[domain]) { // duplicated gesture
                insain_rule_ids.push(id);
            } else if (!/^[UDLR]+$/.test(gesture) || /UU|DD|LL|RR/.test(gesture)) { // wrong gesture format
                insain_rule_ids.push(id);
            } else if (action === 'undefined') { // action not selected
                insain_rule_ids.push(id);
            } else if (action === 'keydown' && !(action_details && /^(Ctrl \+ )?(Shift \+ )?(Alt \+ )?'([A-Z0-9])'/.test(parseKeyboardEvent(action_details)))) { // keyboard event undefined
                insain_rule_ids.push(id);
            } else {
                domains[domain][gesture] = {action, action_details};
            }
        }
        if (insain_rule_ids.length === 0) {
            return domains;
        };
        return false;
    }

    const createCommendFormElement = (domain, gestures) => {
        Object.keys(gestures).forEach((gesture) => {
            createGestureInput(domain, gesture, gestures[gesture].action, gestures[gesture].action_details);
        });
    }

    Object.keys(store.domains).forEach((domain) => {
        createCommendFormElement(domain, store.domains[domain]);
    });

    threshold_angle_form_element.setAttribute('value', store.threshold_angle);
    sampling_period_form_element.setAttribute('value', store.sampling_period);
    scroll_factor_form_element.setAttribute('value', store.scroll_factor);
    use_draw_line_form_element.checked = store.use_draw_line;
    use_action_preview_form_element.checked = store.use_action_preview;
    action_preview_x_offset_form_element.setAttribute('value', store.action_preview_x_offset);
    action_preview_y_offset_form_element.setAttribute('value', store.action_preview_y_offset);

    document.getElementById('add_gesture').onclick = addGestureInput();
    document.getElementById('update').onclick = saveOptions;
    document.getElementById('reset').onclick = () => store.reset();
    document.getElementById('cancle').onclick = () => {
        location.reload();
    };

    store.addOnChangedListener(() => {
        location.reload();
    });

    // import { html, css, LitElement } from 'lit';

    // class Divider extends LitElement {
    //     static styles = css`
    //         .divider {
    //             border-bottom: 0px;
    //             border: 1px solid rgba(0, 0, 0, 0.12);
    //         }
    //     `;

    //     render () {
    //         return html`<hr class="divider">`;
    //     }
    // }

    // customElements.define('custom-divider', Divider);

}

class TopAppBar extends LitElement {
    static properties = {
        title: {type: String},
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

class NavigationDrawer extends LitElement {
    render () {
        const translate = (text) => {
            switch (text) {
                case 'gesture':
                    return '제스처 인식';
                case 'action':
                    return '액션';
                case 'drag_tracking':
                    return '드래그 트래킹';
                case 'action_preview':
                    return '액션 미리보기';
                case 'rules':
                    return '규칙';
            }
        }
        return html`
            <aside class="mdc-drawer mdc-top-app-bar--fixed-adjust">
                <div class="mdc-drawer__content">
                    <nav class="mdc-list">
                        ${option_categories.map(({category}) => html`
                            <a class="mdc-list-item" href="#${category}" aria-current="page">
                                <span class="mdc-list-item__ripple"></span>
                                <span class="mdc-list-item__text">${translate(category)}</span>
                            </a>
                        `)}
                    </nav>
                </div>
            </aside>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

class MainContent extends LitElement {
    render () {
        return html`
            <div class="mdc-drawer-app-content mdc-top-app-bar--fixed-adjust">
                <main class="main-content">
                    <h5 class="mdc-typography--headline5" id='gesture'>List 2</h5>
                    <div class="mdc-layout-grid">
                        <div class="mdc-layout-grid__inner">
                            <div class="mdc-layout-grid__cell">a</div>
                            <div class="mdc-layout-grid__cell">b</div>
                            <div class="mdc-layout-grid__cell">c</div>
                        </div>
                        <div class="mdc-layout-grid__inner">
                            <div class="mdc-layout-grid__cell">a</div>
                            <div class="mdc-layout-grid__cell">b</div>
                            <div class="mdc-layout-grid__cell">c</div>
                        </div>
                    </div>
                    <div class="mdc-list-group">
                        <h3 class="mdc-list-group__subheader">List 2</h3>
                        <ul class="mdc-list">
                            <li class="mdc-list-item">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">line item</span>
                            </li>
                            <li class="mdc-list-item">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">line item</span>
                            </li>
                            <li class="mdc-list-item">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">line item</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <form id="gestures">
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

                            <h2>rules</h2>
                            <div id="rule_template">
                                <input name="domain" type="url" value="*" autocomplete="off" >
                                <input name="gesture" pattern="[UDLR]+" placeholder="[UDLR]+" >
                                <select name="action" >
                                    <option value="undefined">select action</option>
                                    <option value="closeTab">closeTab</option>
                                    <option value="goBack">goBack</option>
                                    <option value="goBackOrCloseTab">goBackOrCloseTab</option>
                                    <option value="goForward">goForward</option>
                                    <option value="scrollTop">scrollTop</option>
                                    <option value="scrollBottom">scrollBottom</option>
                                    <option value="pageDown">pageDown</option>
                                    <option value="pageUp">pageUp</option>
                                    <option value="restore">restore</option>
                                    <option value="keydown">keydown</option>
                                    <option value="reload">reload</option>
                                    <option value="nothing">nothing</option>
                                </select>
                                <input name="keydown" value="" autocomplete="off" />
                                <button type="button" name="remove" >-</button>
                                <br>
                            </div>
                        </form>
                        <button id="add_gesture">+</button><br>
                    </div>
                    <hr class="divider">
                    <div id="footer">
                        <button id="update">변경사항 저장</button>
                        <button id="cancle">취소</button>
                        <button id="reset">기본 설정 불러오기</button>
                    </div>
                </main>
            </div>
        `;
    }
    createRenderRoot () {
        return this;
    }
}

customElements.define('top-app-bar', TopAppBar);
customElements.define('navigation-drawer', NavigationDrawer);
customElements.define('main-content', MainContent);
