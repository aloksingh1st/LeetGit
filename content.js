
async function processSubmission() {
    console.log("DOMContentLoaded event triggered");

    const result = await logSubmissionResult();

    if (result === "Accepted") {
        chrome.runtime.sendMessage({ type: "submissionAccepted" });
    } else {
        console.log("Not accepted");
    }
}

function processSubmissionDelayed() {
    setTimeout(processSubmission, 5000); // 5000 milliseconds = 5 seconds
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


// async function logSubmissionResult() {
//     return new Promise((resolve, reject) => {
//         // Function to check if the submission result element is present
//         const checkSubmissionResult = () => {
//             const element = document.querySelector('[data-e2e-locator="submission-result"]');
//             if (element) {
//                 resolve(element.textContent); // Resolve the promise with the element's text content
//             } else {
//                 setTimeout(checkSubmissionResult, 100); // Check again after a short delay
//             }
//         };

//         // Listen for the button click event and initiate the submission process
//         const submitButton = document.querySelector('[data-e2e-locator="console-submit-button"]');

//         if (submitButton) {
//             submitButton.addEventListener('click', () => {
//                 console.log("SUBMIT BUTTON CLICKED")
//                 setTimeout(checkSubmissionResult, 1000); 
//             });
//         } else {
//             console.log("THIS is runeing");
//             reject(new Error('Submit button not found')); // Reject the promise if the button is not found
//         }
//     });
// }

// // Example usage:
// logSubmissionResult().then(result => {
//     console.log('Submission result:', result);
// }).catch(error => {
//     console.error('Error:', error);
// });



// function handleClick() {
//     console.log("CLICKED");
//     processSubmission();
// }



// document.addEventListener('DOMContentLoaded', function() {

//     console.log("DOMContentLoaded");
// });




console.log("Content script loaded");

// Function to execute your logic
function executeLogic() {
    console.log("Executing logic");
    const button = document.querySelector('[data-e2e-locator="console-submit-button"]');
    if (button) {
        console.log("Button found:", button);
        

        button.addEventListener('click', function() {
            console.log("Button clicked");

            setTimeout(processSubmission, 5000);
        });


    } else {
        console.error("Button not found");
    }
}

// Check if the DOMContentLoaded event has already fired
if (document.readyState === "loading") {
    // If it hasn't, add an event listener to execute when the DOM is ready
    document.addEventListener("DOMContentLoaded", function() {
        console.log("DOMContentLoaded event fired");
        executeLogic();
    });
} else {
    // If the DOMContentLoaded event has already fired, execute your logic immediately
    console.log("DOMContentLoaded event already fired");
    executeLogic();
}

// Observe mutations in the DOM
const observer = new MutationObserver(function(mutationsList, observer) {
    // Check each mutation for added nodes
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if the added nodes contain the button
            const button = document.querySelector('[data-e2e-locator="console-submit-button"]');
            if (button) {
                console.log("Button added to the DOM:", button);
                // If the button is found, execute your logic
                executeLogic();
                observer.disconnect();
                break;
            }
        }
    }
});

// Start observing changes to the entire document
observer.observe(document.documentElement, { childList: true, subtree: true });
