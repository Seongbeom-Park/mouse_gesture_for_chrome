import { default_options } from '@common/default_options';

const getActiveTab = () => chrome.tabs.query({active: true, lastFocusedWindow: true}).then(tabs => tabs[0]);
const restore = () => chrome.sessions.restore();
const closeTab = () => getActiveTab().then((tab) => chrome.tabs.remove(tab.id));
const goBack = () => getActiveTab().then((tab) => chrome.tabs.goBack(tab.id)).then(() => true).catch(() => false);
const openOptions = () => chrome.runtime.openOptionsPage();
const reload = () => chrome.tabs.reload().then(() => true).catch(() => false);

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
            default:
                console.error('unknown gesture');
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
