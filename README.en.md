[한국어 페이지](README.md)

# Mouse Gesture Extension for Chrome Browser
Mouse gesture extension for Chrome browser

## How to Use
1. press down mouse right button
1. drage mouse to execute an action you want to execute
1. release mouse right button

## Settings
1. threshold angle (0 - 90)
    * degree to decide Up, Down, Left, Right move
1. sampling period (>= 1)
    * sensitivity mouse movement detection (more sensitive when less value)
1. page up/down scroll factor (0 - 1)
    * amount of moving when page up/down action
        * example: `0.9`
1. rules
    * which action should be executed by the gesture depends on the domain
    * if the domain exists for a gesture then execute the action, else none of the domain is matching then execute action for `*`
    1. domain
        * domain name to adjust the rule
    1. gesture
        * movement of the mouse
        * gesture consists of U, D, L, R characters
            * possible examples: `U, LU, LR`
            * not available: `lu, UU, LDRR, a`
    1. action
        * closeTab: close focusing tab
        * goBack: go to previous page
        * goBackOrCloseTab: close tab if failed going to previous page
        * goForward: go to next page
        * scrollTop: move to top of the page
        * scrollBottom: move to bottom of the page
        * pageDown: scroll down the page
        * pageUp: scroll up the page
        * restore: re-open the last closed page or window
        * keydown: press virtual keyboard
            * focus on the `<input>` tag when created selecting keydown option, then press keyboard
            * an alphabet or digit with ctrl, shift, alt key
            * example: `Shift + 'N'`, `'1'`

## How to Send a Feedback
1. please create a new [issue](https://github.com/Seongbeom-Park/mouse_gesture_for_chrome/issues)
    * Be careful NOT to include sensitive information, such as personal information

## NOTE
1. NOT working in `<iframe>` tag