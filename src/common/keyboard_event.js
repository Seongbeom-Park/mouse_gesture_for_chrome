export const parseKeyboardEventToString = (event) => {
    if (!event) return '';

    const {ctrlKey, altKey, shiftKey, key, code} = event;
    var value = '';
    if (ctrlKey) value += 'Ctrl + ';
    if (shiftKey) value += 'Shift + ';
    if (altKey) value += 'Alt + ';
    if (/^Digit[0-9]$/.test(code)) value += `'${code.slice(-1)}'`;
    else if (/^[a-zA-Z]$/.test(key)) value += `'${key.toUpperCase()}'`;
    else value += `'${code}'`;

    console.log('parseKeyboardEventToString', value);
    return value;
}
