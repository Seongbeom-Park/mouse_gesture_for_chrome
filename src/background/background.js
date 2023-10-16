import { default_options } from '@common/default_options';

const getCurrentTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);
const getCurrentWindowTabs = () => chrome.tabs.query({lastFocusedWindow: true});
const restore = () => chrome.sessions.restore();
const closeTab = () => getCurrentTab().then((tab) => chrome.tabs.remove(tab.id));
const goBack = () => getCurrentTab().then((tab) => chrome.tabs.goBack(tab.id)).then(() => true).catch(() => false);
const openOptions = () => chrome.runtime.openOptionsPage();
const reload = () => chrome.tabs.reload().then(() => true).catch(() => false);
const scrollTop = () => getCurrentTab().then((tab) => chrome.tabs.sendMessage(tab.id, {action: 'scrollTop'}, (response) => {}));
const scrollBottom = () => getCurrentTab().then((tab) => chrome.tabs.sendMessage(tab.id, {action: 'scrollBottom'}, (response) => {}));
const pageDown = () => getCurrentTab().then((tab) => chrome.tabs.sendMessage(tab.id, {action: 'pageDown'}, (response) => {}));
const pageUp = () => getCurrentTab().then((tab) => chrome.tabs.sendMessage(tab.id, {action: 'pageUp'}, (response) => {}));
const keydown = (details) => getCurrentTab().then((tab) => chrome.tabs.sendMessage(tab.id, {action: 'keydown', details: details}, (response) => {}));
const moveTab = (index, wid) => getCurrentWindowTabs().then((tabs) => chrome.tabs.highlight({tabs: (tabs.length + index) % tabs.length, windowId: wid}));
const moveTabRelative = (index) => getCurrentTab().then((tab) => moveTab(tab.index + index, tab.windowId));
const moveTabAbsolute = (index) => getCurrentTab().then((tab) => moveTab(index, tab.windowId));
const openTab = (details) => getCurrentTab().then((tab) => chrome.tabs.create({...details, index: tab.index + 1, openerTabId: tab.id}));
const openWindow = (details) => chrome.windows.create({...details});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        var result_promise;
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
            case 'scrollTop':
                result_promise = scrollTop();
                break;
            case 'scrollBottom':
                result_promise = scrollBottom();
                break;
            case 'pageDown':
                result_promise = pageDown();
                break;
            case 'pageUp':
                result_promise = pageUp();
                break;
            case 'keydown':
                result_promise = keydown(request.details);
                break;
            case 'moveTabRelative':
                result_promise = moveTabRelative(request.details.index);
                break;
            case 'moveTabAbsolute':
                result_promise = moveTabAbsolute(request.details.index);
                break;
            case 'openTab':
                result_promise = openTab(request.details);
                break;
            case 'openWindow':
                result_promise = openWindow(request.details);
                break;
            default:
                console.error('unknown gesture:', request.gesture);
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
