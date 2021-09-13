chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension")
        if (request.type === "post-user-data") {
            getUserProfileData(request.candidateData)
            sendResponse({responceFromBg: "got_your_message"})
            //chrome.tabs.sendMessage(tabId, {responceFromBg: "got_your_message"})
          //sendResponse({responceFromBg: "got_your_message"});
        }
        return true;
    }
)