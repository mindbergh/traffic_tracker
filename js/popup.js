var statusDisplay = null;
var defaultFrom = "100 McLellan Drive, South San Francisco, CA 94080";
var defaultTo = "reekside Court (A,B,C), 900 Arastradero Rd, Palo Alto, CA 94304";
var defaultInteval = "1";

port = chrome.runtime.connect({
    name: "itc"
});

function startTrack() {
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var interval = document.getElementById("interval").value;
    var key = document.getElementById("api").value;

    if (from !== "" && to !== "" && interval != "") {
        port.postMessage({
            name: "start",
            from: from,
            to: to,
            interval: interval,
            key: key
        });

        statusDisplay.innerHTML = "Started..";

    } else {
        alert("You must enter a value!");
    }

};

function stop() {
    port.postMessage({
        name: "stop",
    })
}

window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');

    document.getElementById("start").addEventListener("submit", startTrack);
    document.getElementById("stop").onclick = stop;
    console.log("Loaded.");


    document.getElementById("from").value = defaultFrom;
    document.getElementById("to").value = defaultTo;
    document.getElementById("interval").value = defaultInteval;
});
