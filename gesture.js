var prevX, prevY;
var menu_enabled = true;
var move_event_count = 0;
var gesture = '';
var prev_token;

var action_element = document.createElement('div');

reset = (initX, initY) => {
    prevX = initX;
    prevY = initY;
    menu_enabled = true;
    move_event_count = 0;
    gesture = '';
    prev_token = undefined;
}

disableContextMenu = (event) => {
    event.preventDefault();
}

onMouseDown = (event) => {
    switch (event.button) {
        case 2: // mouse right button
            reset(event.pageX, event.pageY);
            document.removeEventListener('contextmenu', disableContextMenu);
            document.addEventListener('mousemove', onMouseMove);
            break;
    }
}

onMouseMove = (event) => {
    move_event_count += 1;
    if (move_event_count < sampling_period) {
        return;
    }
    move_event_count = 0;

    if (menu_enabled) {
        document.addEventListener('contextmenu', disableContextMenu);
        menu_enabled = false;
    }

    token = createToken(event.pageX, event.pageY);
    if (token !== prev_token) {
        gesture += token;
        // showAction(gesture);
    }

    prevX = event.pageX;
    prevY = event.pageY;
    prev_token = token;
}

onMouseUp = (event) => {
    switch (event.button) {
        case 2: // mouse right button
            executeGesture(gesture);
            document.removeEventListener('mousemove', onMouseMove);
            break;
    }
}

createToken = (currX, currY) => {
    angle = Math.atan((prevY - currY)/(prevX - currX)) * 180 / Math.PI;
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

executeGesture = (gesture) => {
    if (!(gesture in gestures)) return;
    action = gestures[gesture].action;
    if (!action) return;
    fn = action_map[action];
    if (fn) fn(gestures[gesture].action_details);
}

// showAction = (gesture) => {
//     action = gestures[gesture].action;
//     action_element.appendChild(document.createTextNode(gesture));
//     action_element.hidden = false;
// }

// hideAction = () => {
//     action_element.hidden = true;
// }

enableGesture = () => {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

disableGesture = () => {
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
        updateOptions(options);
    });
});