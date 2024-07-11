import { default_options, option_categories } from '@common/default_options';

class Store extends EventTarget {
    constructor(options) {
        super();
        this._domains = {};
        this._setNoEvent(options);
        
        this.listener_id = 0;
        this.listener_functions = {};
        this.changed = false;

        chrome.storage.onChanged.addListener((changed) => {
            const new_options = {};
            for (const k in changed) {
                const { newValue } = changed[k];
                new_options[k] = newValue;
            }
            this.set(new_options, false);
        });
    }

    get domains () {
        return this._domains;
    }

    set domains (_domains) {
        this._domains = _domains;
        this.gestures = { ...this._domains['*'], ...this._domains[document.domain] };
    }

    reset (category) {
        const new_options = {};
        for (const { category: c, groups } of option_categories) {
            if (c === category) {
                for (const { options } of groups) {
                    for (const { option } of options) {
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
                    keys.push(...(options.map(({option}) => option)));
                }
            }
        }
        chrome.storage.sync.get(keys).then((options) => this.set(options, false));
        this.changed = false;
    }

    _setNoEvent (options) {
        for (const k in default_options) {
            if (k in options) {
                this[k] = options[k];
            }
        }
    }

    set (options, changed = true) {
        this._setNoEvent(options);
        this.dispatchEvent(new Event('Store:set'));
        this.changed = changed;
        this.dispatchEvent(new Event('Store:changed'));
    }

    async sync () {
        await chrome.storage.sync.set({
            domains: this._domains,
            threshold_angle: this.threshold_angle,
            sampling_period: this.sampling_period,
            scroll_factor: this.scroll_factor,
            scroll_smooth: this.scroll_smooth,
            use_draw_line: this.use_draw_line,
            use_action_preview: this.use_action_preview,
            action_preview_x_offset: this.action_preview_x_offset,
            action_preview_y_offset: this.action_preview_y_offset,
            line_width_1: this.line_width_1,
            line_width_2: this.line_width_2,
        });
        this.changed = false;
        this.dispatchEvent(new Event('Store:changed'));
    }

    addRule (domain, gesture, action, action_details) {
        const domains = { ...this.domains };
        if (!(domain in domains)) domains[domain] = {};
        domains[domain][gesture] = { action, action_details };
        this.set({...this, domains });
    }

    removeRule (domain, gesture) {
        const domains = { ...this.domains }
        if (domain in domains) {
            // remove gesture
            if (gesture in domains[domain]) {
                delete domains[domain][gesture];
            }
            // remove domain if empty
            if (Object.keys(domains[domain]).length === 0) {
                delete domains[domain];
            }
        }
        this.set({...this, domains });
    }
}

export const store = await chrome.storage.sync.get().then((options) => new Store(options));
