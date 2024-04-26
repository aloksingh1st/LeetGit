// Listen for messages from content script
// const accessToken = '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'; // Replace with your GitHub personal access token
// const owner = 'aloksingh1st'; // Replace with the owner of the repository
// const repo = 'DSA_QUESTIONS'; // Replace with the name of the repository


// let accessToken;
// let owner;
// let repo;


// chrome.storage.local.get(['accessTokenLeetGit', 'ownerLeetGit', 'repoLeetGit'], function(result) {
//     // Extract data from the result object
//     accessToken = result.accessTokenLeetGit;
//     owner = result.ownerLeetGit;
//     repo = result.repoLeetGit ; 
//     // Use the retrieved data
//     console.log('Access Token:', accessToken);
//     console.log('Owner:', owner);
//     console.log('Repository:', repo);
// });


// Function to create a new commit in the repository
function createCommit(filePath, content, commitMessage) {
    chrome.storage.local.get(['accessTokenLeetGit', 'ownerLeetGit', 'repoLeetGit'], async function(result) {
        const accessToken = result.accessTokenLeetGit;
        const owner = result.ownerLeetGit;
        const repo = result.repoLeetGit;
    
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    
        // Prepare the request body with the file content and commit message
        const body = {
            message: commitMessage,
            content: btoa(content), // Encode content as base64
        };
    
        try {
            // Make a PUT request to create the new file
            const response = await fetch(url, {
                method: 'PUT', // Use PUT method to create new file
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
    
            // Check if the request was successful
            if (response.ok) {
                console.log('File created successfully.');
            } else {
                // Log error message if the request fails
                console.error('Failed to create file:', response.statusText);
            }
        } catch (error) {
            // Log any errors that occur during the request
            console.error('Error creating file:', error);
        }
    });
    
    
}



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "submissionAccepted") {
        // Trigger an alert
        console.log("Submission accepted!");

        chrome.cookies.getAll({}, function (cookies) {
            const headersFromCookies = {};


            cookies.forEach(cookie => {
                if (cookie.name.startsWith('header_')) {
                    const headerName = cookie.name.slice(7); // Remove 'header_' prefix
                    headersFromCookies[headerName] = cookie.value;
                }
            });

            // Include headers extracted from cookies in the fetch request
            fetch('https://leetcode.com/api/submissions/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headersFromCookies
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.error("Submission failed!");
                    }
                }).then(data => {

                    const code = data.submissions_dump[0].code; // Log the response data
                    console.log(data);
                    const title = data.submissions_dump[0].title_slug;
                    console.log(title);

                    const filePath = title + '.cpp';
                    const fileContent = code;
                    const commitMessage = 'Add ' + filePath;

                    createCommit(filePath, fileContent, commitMessage);

                })
                .catch(error => {
                    console.error("Error:", error);
                });
        });
    }
});


