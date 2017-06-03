var alarmName = "tracker";
var from = ""
var to = ""

// Listen for messages.
function messageHandler(message) {
    if (message.name === "start") {

        from = message.from;
        to = message.to;
        updateAlarm(message.interval);
    } else if (message.name === "stop") {
        stopAlarm();
    }
};

function stopAlarm() {
    chrome.alarms.clear(alarmName);
    console.log("Alarm: " + alarmName + " stopped.");
}

function updateAlarm(interval) {
    stopAlarm()

    var intervalInt = parseInt(interval, 10);
    chrome.alarms.create(alarmName, {
        delayInMinutes: 0,
        periodInMinutes: intervalInt,
    });
};


function track() {
    chrome.browserAction.setBadgeText({text: from});
    console.log("Track triggered: " + from + ", " + to);
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
