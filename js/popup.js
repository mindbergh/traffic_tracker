// This callback function is called when the content script has been
// injected and returned its results
function onPageDetailsReceived(pageDetails)  {
    document.getElementById('from').value = pageDetails.from;
    document.getElementById('to').value = pageDetails.to;
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function startTracking() {
    // Cancel the form submit
    event.preventDefault();

    var from = encodeURIComponent(document.getElementById('from').value);
    var to = encodeURIComponent(document.getElementById('to').value);
    var str = from + " " + to;

    statusDisplay.innerHTML = str;
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('starttracking').addEventListener('submit', startTracking);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});
