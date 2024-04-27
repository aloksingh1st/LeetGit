
// const button = document.querySelector('[data-e2e-locator="console-submit-button"]');



async function processSubmission() {
    console.log("DOMContentLoaded event triggered");

    const result = await logSubmissionResult();

    if (result === "Accepted") {
        chrome.runtime.sendMessage({ type: "submissionAccepted" });
    } else {
        console.log("Not accepted");
    }
}

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

        observer.observe(document.body, { childList: true, subtree: true });
    });
}


function handleClick() {
    console.log("CLICKED");
    processSubmission();
}



document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('[data-e2e-locator="console-submit-button"]');
    button.addEventListener('click', handleClick);
});