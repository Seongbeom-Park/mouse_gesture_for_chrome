import { store } from '@common/store';

import '@options/styles/options.scss';
import '@options/top_app_bar';
import '@options/navigation_drawer';
import '@options/main_content';

window.onload = () => {
    // const threshold_angle_form_element = document.getElementById('threshold_angle');
    // const sampling_period_form_element = document.getElementById('sampling_period');
    // const scroll_factor_form_element = document.getElementById('scroll_factor');
    // const use_draw_line_form_element = document.getElementById('use_draw_line');
    // const use_action_preview_form_element = document.getElementById('use_action_preview');
    // const action_preview_x_offset_form_element = document.getElementById('action_preview_x_offset');
    // const action_preview_y_offset_form_element = document.getElementById('action_preview_y_offset');
    // const gestures_form_element = document.getElementById('gestures');
    // const rule_template_element = document.getElementById('rule_template');
    // const keydown_template_element = rule_template_element.querySelector('input[name=keydown]');

    // const onSelectKeydownOption = (id, value) => {
    //     const rule_element = document.getElementById(id);
    //     const keydown_input_element = rule_element.querySelector('input[name=keydown]');
    //     switch (value) {
    //         case 'keydown':
    //             keydown_input_element.style.display = 'inline';
    //             break;
    //         default:
    //             keydown_input_element.style.display = 'none';
    //             break;
    //     }
    // }

    // const parseKeyboardEvent = ({ctrlKey, altKey, shiftKey, key, code}) => {
    //     var value = '';
    //     if (ctrlKey) value += 'Ctrl + ';
    //     if (shiftKey) value += 'Shift + ';
    //     if (altKey) value += 'Alt + ';
    //     if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
    //     if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

    //     return value;
    // }

    // const onKeydownEvent = (keydown_input_element, keyboard_event) => {
    //     keyboard_event.preventDefault();

    //     const {ctrlKey, altKey, shiftKey, key, code, keyCode} = keyboard_event;
    //     keydown_input_element.value = parseKeyboardEvent({ctrlKey, altKey, shiftKey, key, code});
    //     keydown_input_element.action_details = {ctrlKey, altKey, shiftKey, key, code, keyCode};
    // }

    // const updateActionDetails = (keydown_input_element, value) => {
    //     if (!/^(Ctrl \+ )?(Shift \+ )?(Alt \+ )?('[A-Z0-9]')?$/.test(value)) keydown_input_element.value = '';
    // }

    // var next_gesture_id = 0;
    // const createGestureInput = (url = '*', gesture = '', action = 'undefined', action_details) => {
    //     const id = next_gesture_id;

    //     const rule_element = rule_template_element.cloneNode(true);
    //     rule_element.setAttribute('id', `rule_${id}`);
    //     rule_element.style.display = 'inline';

    //     const domain_input_element = rule_element.querySelector('input[name=domain]');
    //     domain_input_element.value = url;

    //     const gesture_input_element = rule_element.querySelector('input[name=gesture]');
    //     gesture_input_element.setAttribute('value', gesture);

    //     const action_input_element = rule_element.querySelector('select[name=action]');
    //     action_input_element.querySelector(`option[value=${action}]`).setAttribute('selected', true);
    //     action_input_element.onchange = (event) => onSelectKeydownOption(event.path[1].id, event.target.value);

    //     const keydown_input_element = rule_element.querySelector('input[name=keydown]');
    //     keydown_input_element.onkeydown = (event) => onKeydownEvent(keydown_input_element, event);
    //     keydown_input_element.onchange = (event) => updateActionDetails(keydown_input_element, event.value);
    //     if (action === 'keydown') {
    //         keydown_input_element.value = parseKeyboardEvent(action_details);
    //         keydown_input_element.action_details = action_details;
    //         keydown_input_element.style.display = 'inline';
    //     }

    //     const remove_button_element = rule_element.querySelector('button[name=remove]');
    //     remove_button_element.onclick = removeGestureInput(id);

    //     gestures_form_element.appendChild(rule_element);

    //     next_gesture_id += 1;
    // }

    // const addGestureInput = () => {
    //     return () => {
    //         createGestureInput();
    //     }
    // }

    // const removeGestureInput = (id) => {
    //     return () => {
    //         document.getElementById(`rule_${id}`).remove();
    //     };
    // }

    // const saveOptions = () => {
    //     const options = {}

    //     const rules = getUpdatedRules();
    //     if (rules){
    //         options['domains'] = rules;
    //     }
    //     const threshold_angle = threshold_angle_form_element.value;
    //     if (threshold_angle){
    //         options['threshold_angle'] = threshold_angle;
    //     }
    //     const sampling_period = sampling_period_form_element.value;
    //     if (sampling_period){
    //         options['sampling_period'] = sampling_period;
    //     }
    //     const scroll_factor = scroll_factor_form_element.value;
    //     if (scroll_factor){
    //         options['scroll_factor'] = scroll_factor;
    //     }
    //     options['use_draw_line'] = use_draw_line_form_element.checked;
    //     options['use_action_preview'] = use_action_preview_form_element.checked;
    //     const action_preview_x_offset = Number(action_preview_x_offset_form_element.value);
    //     if (action_preview_x_offset) {
    //         options['action_preview_x_offset'] = action_preview_x_offset;
    //     }
    //     const action_preview_y_offset = Number(action_preview_y_offset_form_element.value);
    //     if (action_preview_y_offset) {
    //         options['action_preview_y_offset'] = action_preview_y_offset;
    //     }

    //     store.set(options);
    // }

    // const getUpdatedRules = () => {
    //     const insain_rule_ids = [];
    //     const domains = {}
    //     for (var id = 0; id < next_gesture_id; id++) {
    //         const rule_element = gestures_form_element.querySelector(`#rule_${id}`)
    //         if (!rule_element) continue;

    //         const domain = rule_element.querySelector('input[name=domain]')?.value;
    //         const gesture = rule_element.querySelector('input[name=gesture]')?.value;
    //         const action = rule_element.querySelector('select[name=action]')?.value;
    //         const action_details = rule_element.querySelector('input[name=keydown]')?.action_details;
    //         if (!(domain in domains)) domains[domain] = {};
    //         if (gesture in domains[domain]) { // duplicated gesture
    //             insain_rule_ids.push(id);
    //         } else if (!/^[UDLR]+$/.test(gesture) || /UU|DD|LL|RR/.test(gesture)) { // wrong gesture format
    //             insain_rule_ids.push(id);
    //         } else if (action === 'undefined') { // action not selected
    //             insain_rule_ids.push(id);
    //         } else if (action === 'keydown' && !(action_details && /^(Ctrl \+ )?(Shift \+ )?(Alt \+ )?'([A-Z0-9])'/.test(parseKeyboardEvent(action_details)))) { // keyboard event undefined
    //             insain_rule_ids.push(id);
    //         } else {
    //             domains[domain][gesture] = {action, action_details};
    //         }
    //     }
    //     if (insain_rule_ids.length === 0) {
    //         return domains;
    //     };
    //     return false;
    // }

    // const createCommendFormElement = (domain, gestures) => {
    //     Object.keys(gestures).forEach((gesture) => {
    //         createGestureInput(domain, gesture, gestures[gesture].action, gestures[gesture].action_details);
    //     });
    // }

    // Object.keys(store.domains).forEach((domain) => {
    //     createCommendFormElement(domain, store.domains[domain]);
    // });

    // threshold_angle_form_element.setAttribute('value', store.threshold_angle);
    // sampling_period_form_element.setAttribute('value', store.sampling_period);
    // scroll_factor_form_element.setAttribute('value', store.scroll_factor);
    // use_draw_line_form_element.checked = store.use_draw_line;
    // use_action_preview_form_element.checked = store.use_action_preview;
    // action_preview_x_offset_form_element.setAttribute('value', store.action_preview_x_offset);
    // action_preview_y_offset_form_element.setAttribute('value', store.action_preview_y_offset);

    // document.getElementById('add_gesture').onclick = addGestureInput();
    // document.getElementById('update').onclick = saveOptions;
    // document.getElementById('reset').onclick = () => {
    //     store.reset();
    //     store.sync();
    // };
    // document.getElementById('cancle').onclick = () => {
    //     location.reload();
    // };

    // store.addOnChangedListener(() => {
    //     location.reload();
    // });
}
