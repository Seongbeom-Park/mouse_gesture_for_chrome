threshold_angle_form_element = document.getElementById('threshold_angle');
sampling_period_form_element = document.getElementById('sampling_period');
scroll_factor_form_element = document.getElementById('scroll_factor');
use_draw_line_form_element = document.getElementById('use_draw_line');
use_action_preview_form_element = document.getElementById('use_action_preview');
action_preview_x_offset_form_element = document.getElementById('action_preview_x_offset');
action_preview_y_offset_form_element = document.getElementById('action_preview_y_offset');
gestures_form_element = document.getElementById('gestures');
rule_template_element = document.getElementById('rule_template');
keydown_template_element = rule_template_element.querySelector('input[name=keydown]');

onSelectKeydownOption = (id, value) => {
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

parseKeyboardEvent = ({ctrlKey, altKey, shiftKey, key, code}) => {
    var value = '';
    if (ctrlKey) value += 'Ctrl + ';
    if (shiftKey) value += 'Shift + ';
    if (altKey) value += 'Alt + ';
    if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
    if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;

    return value;
}

onKeydownEvent = (keydown_input_element, keyboard_event) => {
    keyboard_event.preventDefault();

    const {ctrlKey, altKey, shiftKey, key, code, keyCode} = keyboard_event;
    keydown_input_element.value = parseKeyboardEvent({ctrlKey, altKey, shiftKey, key, code});
    keydown_input_element.action_details = {ctrlKey, altKey, shiftKey, key, code, keyCode};
}

updateActionDetails = (keydown_input_element, value) => {
    if (!/^(Ctrl \+ )?(Shift \+ )?(Alt \+ )?('[A-Z0-9]')?$/.test(value)) keydown_input_element.value = '';
}

next_gesture_id = 0;
createGestureInput = (url = '*', gesture = '', action = 'undefined', action_details) => {
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

addGestureInput = () => {
    return () => {
        createGestureInput();
    }
}

removeGestureInput = (id) => {
    return () => {
        document.getElementById(`rule_${id}`).remove();
    };
}

saveOptions = () => {
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

    chrome.storage.sync.set(options);
}

getUpdatedRules = () => {
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

createCommendFormElement = (domain, gestures) => {
    Object.keys(gestures).forEach((gesture) => {
        createGestureInput(domain, gesture, gestures[gesture].action, gestures[gesture].action_details);
    });
}

reset = () => {
    return chrome.storage.sync.set(default_options);
}

loadOptions().then((options) => {
    Object.keys(options.domains).forEach((domain) => {
        createCommendFormElement(domain, options.domains[domain]);
    });
    threshold_angle_form_element.setAttribute('value', threshold_angle);
    sampling_period_form_element.setAttribute('value', sampling_period);
    scroll_factor_form_element.setAttribute('value', scroll_factor);
    use_draw_line_form_element.checked = use_draw_line;
    use_action_preview_form_element.checked = use_action_preview;
    action_preview_x_offset_form_element.setAttribute('value', action_preview_x_offset);
    action_preview_y_offset_form_element.setAttribute('value', action_preview_y_offset);

    document.getElementById('add_gesture').onclick = addGestureInput();
    document.getElementById('update').onclick = saveOptions;
    document.getElementById('reset').onclick = reset;
    document.getElementById('cancle').onclick = () => {
        location.reload();
    };

    chrome.storage.onChanged.addListener(() => {
        location.reload();
    });
});