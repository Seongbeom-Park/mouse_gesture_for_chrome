import { store } from '@common/store';
import { translate } from '@common/translate';

const line_class_name = 'mouse_gesture_for_chrome_line';
const line_main_color = '#000000';
const line_width = 2;
const line_top_color = '#FFFFFF';
const line_right_color = '#FFFFFF';
const line_bottom_color = '#FFFFFF';
const line_left_color = '#FFFFFF';
const line_top_border_width = 1;
const line_right_border_width = 0;
const line_bottom_border_width = 0;
const line_left_border_width = 0;

const createLineElement = (x, y, length, angle) => {
    var line = document.createElement("div");
    var styles = 'height: ' + line_width + 'px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '
               + '-ms-transform: rotate(' + angle + 'rad); '
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; '
               + 'background: ' + line_main_color + '; '
               + 'width: ' + length + 'px; '
               + 'border-style: solid; '
               + 'border-top-color: ' + line_top_color + '; '
               + 'border-right-color: ' + line_right_color + '; '
               + 'border-bottom-color: ' + line_bottom_color + '; '
               + 'border-left-color: ' + line_left_color + '; '
               + 'border-top-width: ' + line_top_border_width + 'px; '
               + 'border-right-width: ' + line_right_border_width +  'px; '
               + 'border-bottom-width: ' + line_bottom_border_width + 'px; '
               + 'border-left-width: ' + line_left_border_width + 'px; '
               ;
    line.setAttribute('style', styles);
    line.classList.add(line_class_name);
    return line;
}

export const createLine = (x1, y1, x2, y2) => {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    document.body.appendChild(createLineElement(x, y, c, alpha));
}

export const removeLines = () => {
    [...document.getElementsByClassName(line_class_name)].forEach(e => e.remove());
}


var action_preview;

export const setTextActionPreview = (action_text, x, y) => {
    if (action_preview) {
        action_preview.innerHTML = translate(action_text) ?? "";
    } else {
        action_preview = document.createElement('p');
        action_preview.innerHTML = translate(action_text) ?? "";
        action_preview.style.position = 'absolute';
        action_preview.style.zIndex = 1000;
        action_preview.style.color = 'black';
        action_preview.style.backgroundColor = 'white';
        action_preview.style.left = x + store.action_preview_x_offset + 'px';
        action_preview.style.top = y + store.action_preview_y_offset + 'px';
        document.body.appendChild(action_preview);
    }
}

export const setPositionActionPreview = (x, y) => {
    if (action_preview) {
        action_preview.style.left = x + store.action_preview_x_offset + 'px';
        action_preview.style.top = y + store.action_preview_y_offset + 'px';
    }
}

export const hideActionPreview = () => {
    action_preview = action_preview?.remove();
}
