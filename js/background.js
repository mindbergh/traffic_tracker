var alarmName = "tracker";
var takeOffDelay = 5 * 60 * 1000;
var googleAPIsrc = "https://maps.googleapis.com/maps/api/js?key=YOUR_CLIENT_ID&v=3.28";
var gmapService = null;

// Listen for messages.
function messageHandler(message) {
    if (message.name === "start") {

        setupGoogleAPI(message.key)
        updateAlarm(message.interval);
    } else if (message.name === "stop") {
        stopAlarm();
    }
};

function setupGoogleAPI(key) {
    if (!key) {
        console.error("API key is not there..");
    }
    if (gmapService) {
        return;
    }

    var script = document.createElement("script");
    var src = googleAPIsrc.replace("YOUR_CLIENT_ID", key);

    console.log("Update GoogleMapAPI src as " + src);

    script.setAttribute("src", src);
    script.setAttribute("defer", "");
    script.setAttribute("async", "");
    document.getElementsByTagName("head")[0].appendChild(script);

    return;
}


function stopAlarm() {
    chrome.alarms.clear(alarmName);
    console.log("Alarm: " + alarmName + " stopped.");
}

function updateAlarm(interval) {
    stopAlarm();

    var intervalInt = parseInt(interval, 10);
    chrome.alarms.create(alarmName, {
        delayInMinutes: 0,
        periodInMinutes: intervalInt,
    });
    console.log("Alarm: " + alarmName + " created.");
};


function track() {
    if (!localStorage.hasOwnProperty("from") || !localStorage.hasOwnProperty("to")) {
        console.warn("No instruction found..");
        return;
    }

    //var from =
    var from = localStorage.from;
    var to = localStorage.to;
    console.log("Track triggered: " + from + ", " + to);

    if (!gmapService) {

        try {
            gmapService = new google.maps.DistanceMatrixService();
        } catch(e) {
            setTimeout(track, 2000);
            return;
        }
    }

    gmapService.getDistanceMatrix(
        {
            origins: [from],
            destinations: [to],
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(Date.now() + takeOffDelay)
            },
            avoidHighways: false,
            avoidTolls: false,

        }, trackCallBack
    );
};

function trackCallBack(response, status) {
    if (status !== "OK") {
        console.error("GoogleMap error: " + status);
    }

    var duration = response.rows[0].elements[0].duration_in_traffic.text;
    console.log(duration);
    chrome.browserAction.setBadgeText({text: duration.replace(" mins", "m")});
}

chrome.extension.onConnect.addListener(function(port) {
    if (port.name === "itc") {
        console.log("Connected .....");
        port.onMessage.addListener(messageHandler);
    } else {
        console.warn("Unknown port connected: " + port.name);
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === alarmName) {
        track()
    }
});

