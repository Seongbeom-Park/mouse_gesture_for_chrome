const default_gestures = {
    'D': {action: 'pageDown'},
    'L': {action: 'goBackOrCloseTab'},
    'LU': {action: 'restore'},
    'R': {action: 'goForward'},
    'RD': {action: 'scrollBottom'},
    'RU': {action: 'scrollTop'},
    'U': {action: 'pageUp'},
    'UL': {action: 'moveTabLeft'},
    'UR': {action: 'moveTabRight'},
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
const default_scroll_smooth = true;

const default_use_draw_line = true;
const default_use_action_preview = true;
const default_action_preview_x_offset = 20;
const default_action_preview_y_offset = 0;

export const default_options = {
    'domains': default_domains,
    'threshold_angle': default_threshold_angle,
    'sampling_period': default_sampling_period,
    'scroll_factor': default_scroll_factor,
    'scroll_smooth': default_scroll_smooth,
    'use_draw_line': default_use_draw_line,
    'use_action_preview': default_use_action_preview,
    'action_preview_x_offset': default_action_preview_x_offset,
    'action_preview_y_offset': default_action_preview_y_offset,
    'version': chrome.runtime.getManifest().version,
};

export const option_categories = [
    {
        category: 'rules',
        groups: [
            {
                group: 'rules',
                options: [
                    { option: 'domains' }
                ]
            }
        ]
    },
    {
        category: 'settings',
        groups: [
            {
                group: 'gesture',
                options: [
                    {
                        option: 'threshold_angle',
                        type: 'number',
                        spec: { min: 0, max: 90, step: 1, unit: '°' }
                    },
                    {
                        option: 'sampling_period',
                        type: 'number',
                        spec: { min: 1, max: 20, step: 1, unit: '/tick' }
                    }
                ]
            },
            {
                group: 'action',
                options: [
                    {
                        option: 'scroll_factor',
                        type: 'number',
                        spec: { min: 0, max: 5, step: 0.1, unit: 'page' }
                    },
                    {
                        option: 'scroll_smooth',
                        type: 'boolean',
                    },
                ]
            },
            {
                group: 'drag_tracking',
                options: [
                    {
                        option: 'use_draw_line',
                        type: 'boolean'
                    }
                ]
            },
            {
                group: 'action_preview',
                options: [
                    {
                        option: 'use_action_preview',
                        type: 'boolean',
                        spec: { children: ['action_preview_x_offset', 'action_preview_y_offset'] }
                    },
                    {
                        option: 'action_preview_x_offset',
                        type: 'number',
                        spec: { min: -100, max: 100, step: 1, unit: 'px', dependency: 'use_action_preview' }
                    },
                    {
                        option: 'action_preview_y_offset',
                        type: 'number',
                        spec: { min: -100, max: 100, step: 1, unit: 'px', dependency: 'use_action_preview' }
                    }
                ]
            },
        ]
    },
];
