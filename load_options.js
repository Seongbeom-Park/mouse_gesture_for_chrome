var domains, gestures, sampling_period, threshold_angle, scroll_factor;
var use_draw_line, use_action_preview, action_preview_font_color, action_preview_background_color, action_preview_x_offset, action_preview_y_offset;

updateOptions = (options) => {
    domains = options?.domains ?? domains;
    gestures = {...domains['*'], ...domains[document.domain]}
    threshold_angle = options?.threshold_angle ?? threshold_angle;
    sampling_period = options?.sampling_period ?? sampling_period;
    scroll_factor = options?.scroll_factor ?? scroll_factor;
    use_draw_line = options?.use_draw_line ?? use_draw_line;
    use_action_preview = options?.use_action_preview ?? use_action_preview;
    action_preview_x_offset = options?.action_preview_x_offset ?? action_preview_x_offset;
    action_preview_y_offset = options?.action_preview_y_offset ?? action_preview_y_offset;
}

loadOptions = () => chrome.storage.sync.get().then((options) => {
    updateOptions(options);
    return options;
});