async function openJSON(jsonFile) {
    const response = await fetch(jsonFile);

    if (!response.ok) {
        throw new Error("Error fetching json file");
    }

    return await response.json();
}

async function readTrackJSON(jsonFile) {
    const json = await openJSON(jsonFile)
    const trackData = {}
    trackData["id"] = json["name"]
    trackData["name"] = json["features"][0]["properties"]["Name"]
    trackData["location"] = json["features"][0]["properties"]["Location"]
    trackData["opened"] = json["features"][0]["properties"]["opened"]
    trackData["firstgp"] = json["features"][0]["properties"]["firstgp"]
    trackData["length"] = json["features"][0]["properties"]["length"]
    trackData["altitude"] = json["features"][0]["properties"]["altitude"]
    trackData["points"] = json["features"][0]["geometry"]["coordinates"]
    return trackData
}


export {openJSON, readTrackJSON};