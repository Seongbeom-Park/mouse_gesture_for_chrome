import { updateOptions, loadOptions, gestures, use_action_preview, sampling_period, use_draw_line, threshold_angle } from '@content_scripts/load_options';
import { action_map } from '@content_scripts/actions';
import { createLine, removeLines, setTextActionPreview, setPositionActionPreview, hideActionPreview } from '@content_scripts/ui';

var prevX, prevY;
var menu_enabled = true;
var move_event_count = 0;
var gesture = '';
var prev_token;

var action_element = document.createElement('div');

const reset = (initX, initY) => {
    prevX = initX;
    prevY = initY;
    menu_enabled = true;
    move_event_count = 0;
    gesture = '';
    prev_token = undefined;
}

const disableContextMenu = (event) => {
    event.preventDefault();
}

const onMouseDown = (event) => {
    switch (event.button) {
        case 2: // mouse right button
            reset(event.pageX, event.pageY);
            document.removeEventListener('contextmenu', disableContextMenu);
            document.addEventListener('mousemove', onMouseMove);
            break;
    }
}

const onMouseMove = (event) => {
    if (use_action_preview) setPositionActionPreview(event.pageX, event.pageY);

    move_event_count += 1;
    if (move_event_count < sampling_period) {
        return;
    }
    move_event_count = 0;

    if (menu_enabled) {
        document.addEventListener('contextmenu', disableContextMenu);
        menu_enabled = false;
    }

    if (use_draw_line) createLine(prevX, prevY, event.pageX, event.pageY);

    const token = createToken(event.pageX, event.pageY);
    if (token !== prev_token) {
        gesture += token;
        if (use_action_preview) setTextActionPreview(gestures[gesture]?.action, event.pageX, event.pageY);
    }

    prevX = event.pageX;
    prevY = event.pageY;
    prev_token = token;
}

const onMouseUp = (event) => {
    switch (event.button) {
        case 2: // mouse right button
            removeLines();
            if (use_action_preview) hideActionPreview();
            executeGesture(gesture);
            document.removeEventListener('mousemove', onMouseMove);
            break;
    }
}

const createToken = (currX, currY) => {
    const angle = Math.atan((prevY - currY)/(prevX - currX)) * 180 / Math.PI;
    if (prevX < currX) {
        if (angle > threshold_angle) {
            return 'D';
        } else if (angle < -threshold_angle) {
            return 'U';
        } else {
            return 'R';
        }
    } else if (prevX > currX) {
        if (angle > threshold_angle) {
            return 'U';
        } else if (angle < -threshold_angle) {
            return 'D';
        } else {
            return 'L';
        }
    } else {
        if (prevY < currY) {
            return 'D';
        } else {
            return 'U';
        }
    }
}

const executeGesture = (gesture) => {
    if (!(gesture in gestures)) return;
    const action = gestures[gesture].action;
    if (!action) return;
    const fn = action_map[action];
    if (fn) fn(gestures[gesture].action_details);
}

const enableGesture = () => {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const disableGesture = () => {
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
}

loadOptions().then(() => {
    enableGesture();

    chrome.storage.onChanged.addListener((changes) => {
        const options = {}
        if (changes?.domains) options['domains'] = changes?.domains?.newValue;
        if (changes?.sampling_period) options['sampling_period'] = changes?.sampling_period?.newValue;
        if (changes?.threshold_angle) options['threshold_angle'] = changes?.threshold_angle?.newValue;
        if (changes?.scroll_factor) options['scroll_factor'] = changes?.scroll_factor?.newValue;
        if (changes?.use_draw_line) options['use_draw_line'] = changes?.use_draw_line?.newValue;
        if (changes?.use_action_preview) options['use_action_preview'] = changes?.use_action_preview?.newValue;
        updateOptions(options);
    });
});