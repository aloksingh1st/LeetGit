// Function to save data to chrome.storage and update popup content
function saveAndChangeContent() {
    const owner = document.getElementById('owner').value;
    const accessToken = document.getElementById('accessToken').value;
    const repo = document.getElementById('repo').value;

    // Save data to chrome.storage.local
    chrome.storage.local.set({
        'accessTokenLeetGit': accessToken,
        'ownerLeetGit': owner,
        'repoLeetGit': repo
    }, function () {
        console.log('GitHub details saved.');
    
        
        updatePopupContent(owner, accessToken, repo);
    });
}

function getDetails() {
    chrome.storage.local.get(['accessTokenLeetGit', 'ownerLeetGit', 'repoLeetGit'], function(result) {
        // Extract data from the result object
        const accessToken = result.accessTokenLeetGit;
        const owner = result.ownerLeetGit;
        const repo = result.repoLeetGit;

        if(accessToken){
            updatePopupContent(owner, accessToken, repo);
        }
    });
}

// Function to update popup content based on saved data
function updatePopupContent(owner, accessToken, repo) {
    // Update HTML elements with saved data
    document.getElementById("inputcontainer").style.display = 'none';
    document.getElementById("details").style.display = "block";
    document.getElementById('savedOwner').textContent = owner;
    document.getElementById('savedAccessToken').textContent = accessToken;
    document.getElementById('savedRepo').textContent = repo;
}


function removeDetails(){
    chrome.storage.local.remove(['accessTokenLeetGit', 'ownerLeetGit', 'repoLeetGit'], function() {
        console.log('Data removed from storage.');
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
    // removeDetails()
    document.getElementById("details").style.display = "none";
    getDetails();
    document.getElementById('saveButton').addEventListener('click', saveAndChangeContent);
});
