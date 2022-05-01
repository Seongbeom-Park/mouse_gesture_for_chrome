closeTab = () => chrome.runtime.sendMessage({gesture: 'closeTab'});
goBack = () => chrome.runtime.sendMessage({gesture: 'goBack'});
goBackOrCloseTab = () => goBack().then((moved) => moved || closeTab());
goForward = () => history.forward();
scrollTop = () => window.scrollTo({left: document.documentElement.scrollLeft, top: 0, behavior: 'smooth'});
scrollBottom = () => window.scrollTo({left: document.documentElement.scrollLeft, top: document.documentElement.scrollHeight, behavior: 'smooth'});
pageDown = () => window.scrollBy({left: document.documentElement.scrollLeft, top: window.innerHeight * scroll_factor, behavior: 'smooth'});
pageUp = () => window.scrollBy({left: document.documentElement.scrollLeft, top: -window.innerHeight * scroll_factor, behavior: 'smooth'});
restore = () => chrome.runtime.sendMessage({gesture: 'restore'});
keydown = (details) => document.dispatchEvent(new KeyboardEvent('keydown', details));
reload = () => chrome.runtime.sendMessage({gesture: 'reload'});
nothing = () => {};

const action_map = {
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