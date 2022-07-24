import { scroll_factor } from '@content_scripts/load_options';

const closeTab = () => chrome.runtime.sendMessage({gesture: 'closeTab'});
const goBack = () => chrome.runtime.sendMessage({gesture: 'goBack'});
const goBackOrCloseTab = () => goBack().then((moved) => moved || closeTab());
const goForward = () => history.forward();
const scrollTop = () => window.scrollTo({left: document.documentElement.scrollLeft, top: 0, behavior: 'smooth'});
const scrollBottom = () => window.scrollTo({left: document.documentElement.scrollLeft, top: document.documentElement.scrollHeight, behavior: 'smooth'});
const pageDown = () => window.scrollBy({left: document.documentElement.scrollLeft, top: window.innerHeight * scroll_factor, behavior: 'smooth'});
const pageUp = () => window.scrollBy({left: document.documentElement.scrollLeft, top: -window.innerHeight * scroll_factor, behavior: 'smooth'});
const restore = () => chrome.runtime.sendMessage({gesture: 'restore'});
const keydown = (details) => document.dispatchEvent(new KeyboardEvent('keydown', details));
const reload = () => chrome.runtime.sendMessage({gesture: 'reload'});
const nothing = () => {};

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