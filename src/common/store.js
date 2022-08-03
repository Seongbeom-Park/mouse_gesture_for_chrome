import { default_options, option_categories } from '@common/default_options';

class Store extends EventTarget {
    constructor(options) {
        super();
        this._domains = {};
        this._setNoEvent(options);
        
        this.listener_id = 0;
        this.listener_functions = {};

        chrome.storage.onChanged.addListener((changed) => {
            const new_options = {};
            for (const k in changed) {
                const { newValue } = changed[k];
                new_options[k] = newValue;
            }
            this.set(new_options);
        });
    }

    get domains () {
        return this._domains;
    }

    reset (category) {
        const new_options = {};
        for (const { category: c, groups } of option_categories) {
            if (c === category) {
                for (const { options } of groups) {
                    for (const option of options) {
                        new_options[option] = default_options[option];
                    }
                }
            }
        }
        return this.set(new_options);
    }

    revert (category) {
        const keys = [];
        for (const { category: c, groups } of option_categories) {
            if (c === category) {
                for (const { options } of groups) {
                        keys.push(...options);
                }
            }
        }
        chrome.storage.sync.get(keys).then((options) => this.set(options));
    }

    _setNoEvent (options) {
        for (const k in default_options) {
            if (k in options) {
                if (k === 'domains') {
                    this._domains = options[k];
                    this.gestures = {...this._domains['*'], ...this._domains[document.domain]}
                } else this[k] = options[k];
            }
        }
    }

    set (options) {
        this._setNoEvent(options);
        this.dispatchEvent(new Event('Store:set'));
    }

    sync () {
        return chrome.storage.sync.set({
            domains: this._domains,
            threshold_angle: this.threshold_angle,
            sampling_period: this.sampling_period,
            scroll_factor: this.scroll_factor,
            use_draw_line: this.use_draw_line,
            use_action_preview: this.use_action_preview,
            action_preview_x_offset: this.action_preview_x_offset,
            action_preview_y_offset: this.action_preview_y_offset,
        });
    }

    // addRule (domain, gesture, action, details) {}
    removeRule (domain, gesture) {
        if (domain in this._domains) {
            // remove gesture
            if (gesture in this._domains[domain]) {
                delete this._domains[domain][gesture];
            }
            // remove domain if empty
            if (Object.keys(this._domains[domain]).length === 0) {
                delete this._domains[domain];
            }
        }
        this.dispatchEvent(new Event('Store:set'));
    }
}

export const store = await chrome.storage.sync.get().then((options) => new Store(options));
