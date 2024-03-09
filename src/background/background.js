import { default_options } from '@common/default_options';

const getCurrentWindowTabs = () => chrome.tabs.query({lastFocusedWindow: true});
const openOptions = () => chrome.runtime.openOptionsPage();
const sendMessage = (tabId, message) => chrome.tabs.sendMessage(tabId, message);
const moveTab = (index, wid) => getCurrentWindowTabs().then((tabs) => chrome.tabs.highlight({tabs: (tabs.length + index) % tabs.length, windowId: wid}));
const getWindow = (wid) => chrome.windows.get(wid);
const updateWindow = (wid, updateInfo) => chrome.windows.update(wid, updateInfo);
const updateWindowSize = (wid, next_state) => getWindow(wid)
            .then(({state}) => {
                if (state === next_state) updateWindow(wid, {state: 'normal'});
                else updateWindow(wid, {state: next_state});
            })

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const gesture = request.gesture;
        const details = request.details;

        const tabId = sender.tab.id;
        const tabIndex = sender.tab.index;
        const windowId = sender.tab.windowId;

        var result_promise;
        switch(gesture) {
            case 'restore':
                result_promise = chrome.sessions.restore();
                break;
            case 'closeTab':
                result_promise =  chrome.tabs.remove(tabId);
                break;
            case 'goBack':
                result_promise = chrome.tabs.goBack(tabId).then(() => true).catch(() => false);
                break;
            case 'reload':
                result_promise = chrome.tabs.reload().then(() => true).catch(() => false);
                break;
            case 'scrollTop':
                result_promise = sendMessage(tabId, {action: 'scrollTop'});
                break;
            case 'scrollBottom':
                result_promise = sendMessage(tabId, {action: 'scrollBottom'});
                break;
            case 'pageDown':
                result_promise = sendMessage(tabId, {action: 'pageDown'});
                break;
            case 'pageUp':
                result_promise = sendMessage(tabId, {action: 'pageUp'});
                break;
            case 'keydown':
                result_promise = sendMessage(tabId, {action: 'keydown', details: details});
                break;
            case 'moveTabRelative':
                result_promise = moveTab(tabIndex + details.index, windowId);
                break;
            case 'moveTabAbsolute':
                result_promise = moveTab(details.index, windowId);
                break;
            case 'openTab':
                result_promise = chrome.tabs.create({...details, index: tabIndex + 1, openerTabId: tabId});
                break;
            case 'openWindow':
                result_promise = chrome.windows.create({...details});
                break;
            case 'normalizeWindow':
                result_promise = updateWindowSize(windowId, 'normal');
                break;
            case 'minimizeWindow':
                result_promise = updateWindowSize(windowId, 'minimized');
                break;
            case 'maximizeWindow':
                result_promise = updateWindowSize(windowId, 'maximized');
                break;
            case 'fullscreenWindow':
                result_promise = updateWindowSize(windowId, 'fullscreen');
                break;
            default:
                console.error('unknown gesture:', gesture);
                return false;
        }
        result_promise.then(sendResponse);
        return true;
    }
);

chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case 'install':
            chrome.storage.sync.set(default_options);
            openOptions();
            break;
        case 'update':
            chrome.storage.sync.get().then((options) => {
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
