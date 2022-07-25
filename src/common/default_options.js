const default_gestures = {
    'D': {action: 'pageDown'},
    'L': {action: 'goBackOrCloseTab'},
    'LU': {action: 'restore'},
    'R': {action: 'goForward'},
    'RD': {action: 'scrollBottom'},
    'RU': {action: 'scrollTop'},
    'U': {action: 'pageUp'},
};
const default_domains = {
    '*': default_gestures,
    'www.youtube.com': {
        'R': {action: 'keydown', action_details: {ctrlKey: false, altKey: false, shiftKey: true, key:'N', code:'KeyN', keyCode: 78}},
    },
}
const default_sampling_period = 5;
const default_threshold_angle = 45;
const default_scroll_factor = 0.9;

const default_use_draw_line = true;
const default_use_action_preview = true;
const default_action_preview_x_offset = 20;
const default_action_preview_y_offset = 0;

export const default_options = {
    'domains': default_domains,
    'threshold_angle': default_threshold_angle,
    'sampling_period': default_sampling_period,
    'scroll_factor': default_scroll_factor,
    'use_draw_line': default_use_draw_line,
    'use_action_preview': default_use_action_preview,
    'action_preview_x_offset': default_action_preview_x_offset,
    'action_preview_y_offset': default_action_preview_y_offset,
    'version': chrome.runtime.getManifest().version,
};
