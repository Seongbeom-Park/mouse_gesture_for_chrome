export const WindowState = {
    NORMAL: 'normal',
    MINIMIZED: 'minimized',
    MAXIMIZED: 'maximized',
    FULLSCREEN: 'fullscreen',
}

var window_state_cache = {};

const initWindowStateCache = (wid, curr_state) => {
    window_state_cache[wid] ??= {
        extensionEvent: false,
        prev: WindowState.NORMAL,
        curr: curr_state,
    };
};

export const updateWindowSize = (wid, state) => {
    return chrome.windows.getCurrent().then((window) => {
        let curr_state = window.state;
        initWindowStateCache(wid, curr_state);
        let next_state = (curr_state === state) ? window_state_cache[wid].prev : state;
        if (curr_state !== next_state) {
            window_state_cache[wid].extensionEvent = true;
            window_state_cache[wid].prev = window_state_cache[wid].curr;
            window_state_cache[wid].curr = next_state;
        }
        return chrome.windows.update(wid, {state: next_state});
    });
};

chrome.windows.onCreated.addListener((window) => {
    initWindowStateCache(window.id, window.state);
});

chrome.windows.onBoundsChanged.addListener((window) => {
    let {id: wid, state} = window;
    initWindowStateCache(wid, state);
    if (window_state_cache[wid].extensionEvent) { // transition by extension event
        if (window_state_cache[wid].curr === state) { // end of transitions
            window_state_cache[wid].extensionEvent = false;
        }
    } else { // transition by user control
        window_state_cache[wid].prev = window_state_cache[wid].curr;
        window_state_cache[wid].curr = state;
    }
});

chrome.windows.onRemoved.addListener((window_id) => {
    delete window_state_cache[window_id];
});
