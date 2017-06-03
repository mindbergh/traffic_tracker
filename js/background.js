var alarmName = "tracker";

// Listen for messages.
function messageHandler(message) {
    if (message.name === "query") {
        var from = message.from;
        var to = message.to;

        track(from, to);
    }
};

function track(from, to) {
    chrome.browserAction.setBadgeText({text: from});
    console.log("Message got: " + from + ", " + to);
};


chrome.extension.onConnect.addListener(function(port) {
    if (port.name === "itc") {
        console.log("Connected .....");
        port.onMessage.addListener(messageHandler);
    } else {
        console.warn("Unknown port connected: " + port.name);
    }
});
