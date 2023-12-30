function openJSON(file) {
    let request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error('Failed to load file: ' + file);
    }
}

export { openJSON };
