import { store } from '@common/store';

// send a message from frame to background service
const closeTab = () => chrome.runtime.sendMessage({gesture: 'closeTab'});
const goBack = () => chrome.runtime.sendMessage({gesture: 'goBack'});
const goBackOrCloseTab = () => goBack().then((moved) => moved || closeTab());
const goForward = () => history.forward();
const scrollTop = () => chrome.runtime.sendMessage({gesture: 'scrollTop'});
const scrollBottom = () => chrome.runtime.sendMessage({gesture: 'scrollBottom'});
const pageDown = () => chrome.runtime.sendMessage({gesture: 'pageDown'});
const pageUp = () => chrome.runtime.sendMessage({gesture: 'pageUp'});
const restore = () => chrome.runtime.sendMessage({gesture: 'restore'});
const keydown = (details) => document.dispatchEvent(new KeyboardEvent('keydown', details));
const reload = () => chrome.runtime.sendMessage({gesture: 'reload'});
const nothing = () => {};

// receive a message from background service
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab) { // from background service
        switch(request.action) {
            case 'scrollTop':
                window.scrollTo({left: document.documentElement.scrollLeft, top: 0, behavior: 'smooth'});
                break;
            case 'scrollBottom':
                window.scrollTo({left: document.documentElement.scrollLeft, top: document.documentElement.scrollHeight, behavior: 'smooth'});
                break;
            case 'pageDown':
                window.scrollBy({left: document.documentElement.scrollLeft, top: window.innerHeight * store.scroll_factor, behavior: 'smooth'});
                break;
            case 'pageUp':
                window.scrollBy({left: document.documentElement.scrollLeft, top: -window.innerHeight * store.scroll_factor, behavior: 'smooth'});
                break;
            default:
                result = `unknown action: ${request.action}`
                console.error(result);
                sendResponse({result: result});
                return false;
        }
    }
    sendResponse({result: 'done'});
});

export const action_map = {
    'closeTab': closeTab,
    'goBack': goBack,
    'goBackOrCloseTab': goBackOrCloseTab,
    'goForward': goForward,
    'scrollTop': scrollTop,
    'scrollBottom': scrollBottom,
    'pageDown': pageDown,
    'pageUp': pageUp,
    'restore': restore,
    'keydown': keydown,
    'reload': reload,
    'nothing': nothing,
};

export const action_list = [
    'closeTab',
    'goBack',
    'goBackOrCloseTab',
    'goForward',
    'scrollTop',
    'scrollBottom',
    'pageDown',
    'pageUp',
    'restore',
    'keydown',
    'reload',
    'nothing',
];
