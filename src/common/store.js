import { default_options } from '@common/default_options';

class Store {
    constructor(options) {
        this.set(options);
        chrome.storage.onChanged.addListener((changed) => this.set({
            domains: changed?.domains?.newValue,
            threshold_angle: changed?.threshold_angle?.newValue,
            sampling_period: changed?.sampling_period?.newValue,
            scroll_factor: changed?.scroll_factor?.newValue,
            use_draw_line: changed?.use_draw_line?.newValue,
            use_action_preview: changed?.use_action_preview?.newValue,
            action_preview_x_offset: changed?.action_preview_x_offset?.newValue,
            action_preview_y_offset: changed?.action_preview_y_offset?.newValue,
            version: changed?.version?.newValue,
        }));
        this.listener_id = 0;
        this.listener_functions = {};
    }

    reset () {
        return this.set(default_options);
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
            version: this.version,
        });
    }

    set (options) {
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

    addOnChangedListener (fn) {
        this.listener_id += 1;
        this.listener_functions[this.listener_id] = () => fn(this);
        chrome.storage.onChanged.addListener(this.listener_functions[this.listener_id]);
        return this.listener_id;
    }

    removeOnChangedListener (id) {
        const fn = this.listener_functions[id];
        chrome.storage.onChanged.removeListener(fn);
    }
}

export const store = await chrome.storage.sync.get().then((options) => new Store(options));
