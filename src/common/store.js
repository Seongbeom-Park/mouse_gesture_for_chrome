import { default_options, option_categories } from '@common/default_options';

class Store extends EventTarget {
    constructor(options) {
        super();
        this.domains = {};
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
                this[k] = options[k];
                if (k === 'domains') this.gestures = {...this.domains['*'], ...this.domains[document.domain]}
            }
        }
    }

    set (options) {
        this._setNoEvent(options);
        this.dispatchEvent(new Event('Store:set'));
    }

    sync () {
        return chrome.storage.sync.set({
            domains: this.domains,
            threshold_angle: this.threshold_angle,
            sampling_period: this.sampling_period,
            scroll_factor: this.scroll_factor,
            use_draw_line: this.use_draw_line,
            use_action_preview: this.use_action_preview,
            action_preview_x_offset: this.action_preview_x_offset,
            action_preview_y_offset: this.action_preview_y_offset,
        });
    }
}

export const store = await chrome.storage.sync.get().then((options) => new Store(options));
