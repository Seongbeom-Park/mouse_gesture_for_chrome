getActiveTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);

restore = () => chrome.sessions.restore();
closeTab = () => getActiveTab().then((tab) => chrome.tabs.remove(tab.id));
goBack = () => getActiveTab().then((tab) => chrome.tabs.goBack(tab.id)).then(() => true).catch(() => false);
openOptions = () => chrome.runtime.openOptionsPage();
reload = () => chrome.tabs.reload().then(() => true).catch(() => false);

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        let result_promise;
        switch(request.gesture) {
            case 'restore':
                result_promise = restore();
                break;
            case 'closeTab':
                result_promise = closeTab();
                break;
            case 'goBack':
                result_promise = goBack();
                break;
            case 'reload':
                result_promise = reload();
                break;
            default:
                console.error('unknown gesture');
                return false;
        }
        result_promise.then(sendResponse);
        return true;
    }
);

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

const default_options = {
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

chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case 'install':
            chrome.storage.sync.set(default_options);
            openOptions();
            break;
        case 'update':
            chrome.storage.sync.get().then(options => {
                chrome.storage.sync.set({
                    ...default_options,
                    ...options,
                    'version': chrome.runtime.getManifest().version
                });
            });
            break;
        default:
            break;
    }
});

chrome.action.onClicked.addListener(openOptions);