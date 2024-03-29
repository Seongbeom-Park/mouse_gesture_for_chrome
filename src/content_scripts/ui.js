import { store } from '@common/store';
import { translate } from '@common/translate';

const line_class_name = 'mouse_gesture_for_chrome_line';

const createLineElement = (x, y, length, angle) => {
    var line = document.createElement("div");
    var styles = 'border: 1px solid black; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '
               + '-ms-transform: rotate(' + angle + 'rad); '
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
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
