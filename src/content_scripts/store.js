import { default_options } from '@common/default_options';

class Store {
    constructor(options) {
        this.domains = options?.domains ?? this.domains ?? {};
        this.gestures = {...this.domains['*'], ...this.domains[document.domain]}
        this.threshold_angle = options?.threshold_angle ?? this.threshold_angle;
        this.sampling_period = options?.sampling_period ?? this.sampling_period;
        this.scroll_factor = options?.scroll_factor ?? this.scroll_factor;
        this.use_draw_line = options?.use_draw_line ?? this.use_draw_line;
        this.use_action_preview = options?.use_action_preview ?? this.use_action_preview;
        this.action_preview_x_offset = options?.action_preview_x_offset ?? this.action_preview_x_offset;
        this.action_preview_y_offset = options?.action_preview_y_offset ?? this.action_preview_y_offset;
    }

    reset () {
        return this.set(default_options);
    }

    set (options) {
        return chrome.storage.sync.set(options);
    }

    addOnChangedListener (fn) {
        return chrome.storage.onChanged.addListener(fn);
    }
}

export const store = await chrome.storage.sync.get().then((options) => new Store(options));
