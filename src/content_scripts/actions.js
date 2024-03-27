import { store } from '@common/store';

// send a message from frame to background service
const sendMessage = (message) => chrome.runtime.sendMessage(message);
const closeTab = () => sendMessage({gesture: 'closeTab'});
const goBack = () => sendMessage({gesture: 'goBack'});
const goBackOrCloseTab = () => goBack().then((moved) => moved || closeTab());
const goForward = () => history.forward();
const scrollTop = () => sendMessage({gesture: 'scrollTop'});
const scrollBottom = () => sendMessage({gesture: 'scrollBottom'});
const pageDown = () => sendMessage({gesture: 'pageDown'});
const pageUp = () => sendMessage({gesture: 'pageUp'});
const restore = () => sendMessage({gesture: 'restore'});
const keydown = (details) => sendMessage({gesture: 'keydown', details: details});
const reload = () => sendMessage({gesture: 'reload'});
const moveTabRelative = (details) => sendMessage({gesture: 'moveTabRelative', details: details});
const moveTabLeft = () => moveTabRelative({index: -1});
const moveTabRight = () => moveTabRelative({index: +1});
const moveTabAbsolute = (details) => sendMessage({gesture: 'moveTabAbsolute', details: details});
const moveTabFirst = () => moveTabAbsolute({index: 0});
const moveTabLast = () => moveTabAbsolute({index: -1});
const openTab = (details) => sendMessage({gesture: 'openTab', details: details});
const openWindow = (details) => sendMessage({gesture: 'openWindow', details: details});
const openOptions = () => sendMessage({gesture: 'openOptions'});
const normalizeWindow = () => sendMessage({gesture: 'normalizeWindow'});
const minimizeWindow = () => sendMessage({gesture: 'minimizeWindow'});
const maximizeWindow = () => sendMessage({gesture: 'maximizeWindow'});
const fullscreenWindow = () => sendMessage({gesture: 'fullscreenWindow'});
const nothing = () => {};

// receive a message from background service
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!sender.tab) { // from background service
        switch(request.action) {
            case 'scrollTop':
                window.scrollTo({
                    left: document.documentElement.scrollLeft,
                    top: 0,
                    behavior: store.scroll_smooth ? 'smooth' : 'instant'});
                break;
            case 'scrollBottom':
                window.scrollTo({
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollHeight,
                    behavior: store.scroll_smooth ? 'smooth' : 'instant'});
                break;
            case 'pageDown':
                window.scrollBy({
                    left: document.documentElement.scrollLeft,
                    top: window.innerHeight * store.scroll_factor,
                    behavior: store.scroll_smooth ? 'smooth' : 'instant'});
                break;
            case 'pageUp':
                window.scrollBy({
                    left: document.documentElement.scrollLeft,
                    top: -window.innerHeight * store.scroll_factor,
                    behavior: store.scroll_smooth ? 'smooth' : 'instant'});
                break;
            case 'keydown':
                document.dispatchEvent(new KeyboardEvent('keydown', request.details));
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
    'moveTabLeft': moveTabLeft,
    'moveTabRight': moveTabRight,
    'moveTabFirst': moveTabFirst,
    'moveTabLast': moveTabLast,
    'openTab': openTab,
    'openWindow': openWindow,
    'normalizeWindow': normalizeWindow,
    'minimizeWindow': minimizeWindow,
    'maximizeWindow': maximizeWindow,
    'fullscreenWindow': fullscreenWindow,
    'openOptions': openOptions,
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
    'moveTabLeft',
    'moveTabRight',
    'moveTabFirst',
    'moveTabLast',
    'openTab',
    'openWindow',
    'normalizeWindow',
    'minimizeWindow',
    'maximizeWindow',
    'fullscreenWindow',
    'openOptions',
    'nothing',
];
