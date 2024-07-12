import { openOptions } from '@background/install';
import { updateWindowSize, WindowState } from '@background/update_window';

const getCurrentWindowTabs = () => chrome.tabs.query({lastFocusedWindow: true});
const sendMessage = (tabId, message) => chrome.tabs.sendMessage(tabId, message);
const moveTab = (index, wid) => getCurrentWindowTabs().then((tabs) => chrome.tabs.highlight({tabs: (tabs.length + index) % tabs.length, windowId: wid}));

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const gesture = request.gesture;
        const details = request.details;

        const tab_id = sender.tab.id;
        const tab_index = sender.tab.index;
        const window_id = sender.tab.windowId;

        var result_promise;
        switch(gesture) {
            case 'restore':
                result_promise = chrome.sessions.restore();
                break;
            case 'closeTab':
                result_promise =  chrome.tabs.remove(tab_id);
                break;
            case 'goBack':
                result_promise = chrome.tabs.goBack(tab_id).then(() => true).catch(() => false);
                break;
            case 'reload':
                result_promise = chrome.tabs.reload().then(() => true).catch(() => false);
                break;
            case 'scrollTop':
                result_promise = sendMessage(tab_id, {action: 'scrollTop'});
                break;
            case 'scrollBottom':
                result_promise = sendMessage(tab_id, {action: 'scrollBottom'});
                break;
            case 'pageDown':
                result_promise = sendMessage(tab_id, {action: 'pageDown'});
                break;
            case 'pageUp':
                result_promise = sendMessage(tab_id, {action: 'pageUp'});
                break;
            case 'keydown':
                result_promise = sendMessage(tab_id, {action: 'keydown', details: details});
                break;
            case 'moveTabRelative':
                result_promise = moveTab(tab_index + details.index, window_id);
                break;
            case 'moveTabAbsolute':
                result_promise = moveTab(details.index, window_id);
                break;
            case 'openTab':
                result_promise = chrome.tabs.create({...details, index: tab_index + 1, openerTabId: tab_id});
                break;
            case 'copyTab':
                result_promise = chrome.tabs.duplicate(tab_id);
                break;
            case 'openWindow':
                result_promise = chrome.windows.create({...details});
                break;
            case 'normalizeWindow':
                result_promise = updateWindowSize(window_id, WindowState.NORMAL);
                break;
            case 'minimizeWindow':
                result_promise = updateWindowSize(window_id, WindowState.MINIMIZED);
                break;
            case 'maximizeWindow':
                result_promise = updateWindowSize(window_id, WindowState.MAXIMIZED);
                break;
            case 'fullscreenWindow':
                result_promise = updateWindowSize(window_id, WindowState.FULLSCREEN);
                break;
            case 'openOptions':
                result_promise = openOptions();
                break;
            default:
                console.error('unknown gesture:', gesture);
                return false;
        }
        result_promise.then(sendResponse);
        return true;
    }
);
