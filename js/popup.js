var statusDisplay = null;

port = chrome.runtime.connect({
    name: "itc"
});

function startTrack() {
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;

    if (from !== "") {
        port.postMessage({
            name: "query",
            from: from,
            to: to
        });

        statusDisplay.innerHTML = "Started..";

    } else {
        alert("You must enter a value!");
    }

};

window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');

    document.getElementById("starttracking").addEventListener("submit", startTrack);
    console.log("Loaded.");
});
