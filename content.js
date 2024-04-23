// content.js

async function processSubmission() {
    console.log("DOMContentLoaded event triggered");

    const result = await logSubmissionResult();

    if (result === "Accepted") {
        chrome.runtime.sendMessage({ type: "submissionAccepted" });
    } else {
        console.log("Not accepted");
    }
}

// document.addEventListener('DOMContentLoaded', processSubmission);
processSubmission();

async function logSubmissionResult() {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    const element = document.querySelector('[data-e2e-locator="submission-result"]');
                    if (element) {
                        observer.disconnect(); 
                        resolve(element.textContent); 
                    }
                }
            }
        });

        // Start observing changes in the DOM
        observer.observe(document.body, { childList: true, subtree: true });
    });
}
