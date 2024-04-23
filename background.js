// background.js

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "submissionAccepted") {
        // Trigger an alert
        console.log("Submission accepted!");
    }
});


