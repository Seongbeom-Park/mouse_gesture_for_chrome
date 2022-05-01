var domains, gestures, sampling_period, threshold_angle, scroll_factor;

updateOptions = (options) => {
    domains = options?.domains ?? domains;
    gestures = {...options.domains['*'], ...options.domains[document.domain]}
    threshold_angle = options?.threshold_angle ?? threshold_angle;
    sampling_period = options?.sampling_period ?? sampling_period;
    scroll_factor = options?.scroll_factor ?? scroll_factor;
}

loadOptions = () => chrome.storage.sync.get().then((options) => {
    updateOptions(options);
    return options;
});