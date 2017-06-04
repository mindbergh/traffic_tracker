var statusDisplay = null;
var defaultFrom = "100 McLellan Drive, South San Francisco, CA 94080";
var defaultTo = "reekside Court (A,B,C), 900 Arastradero Rd, Palo Alto, CA 94304";
var defaultInteval = "1";

port = chrome.runtime.connect({
    name: "itc"
});

function startTrack() {
    var interval = document.getElementById("interval").value;
    if (!localStorage.hasOwnProperty("apikey")) {
        console.error("Please update API key.");
        return;
    }

    key = localStorage.apikey;

    if (interval !== "") {
        localStorage.interval = interval;

        port.postMessage({
            name: "start",
            interval: interval,
            key: key
        });

        console.log("Track started..")


    } else {
        console.error("You must enter a value!");
    }

};

function stop() {
    port.postMessage({
        name: "stop",
    })

    console.log("Track stopped..")
}

function updateLocalStorage() {
    var key = document.getElementById("apikey").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;

    updateLocal("apikey", key);
    updateLocal("from", from);
    updateLocal("to", to);
}

window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');

    document.getElementById("start").addEventListener("submit", startTrack);
    document.getElementById("stop").onclick = stop;
    document.getElementById("update").onclick = updateLocalStorage;
    console.log("Loaded.");

    refreshDefault("from");
    refreshDefault("to");
    refreshDefault("interval");
    //refreshDefault("apikey");
});


function refreshDefault(name) {
    if (localStorage.hasOwnProperty(name)) {
        document.getElementById(name).value = localStorage[name];
    }
}

function updateLocal(name, value) {
    if (value !== "") {
        localStorage[name] = value;
        console.log("LocalStorage updated for " + name + " as " + value);
    }
}
