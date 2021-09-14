chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('sender.tab.id', sender.tab.id)
        if (request.type === "post-user-data") {
            getUserProfileData(request.candidateData)
            sendResponse({responceFromBg: "got_your_message"})
            chrome.tabs.sendMessage(sender.tab.id, {type: 'hello hey there i am working'})
        }

        console.log('bg all requests: ', request)
        // if (request.greeting === "hello from setIntervall") {
        //     alert('greeting: "hello from setIntervall"')
        // }
        return true;
    }
)

/*
sender 
frameId: 0
id: "ndgmolgognkcnojcmdjfkmbbdapdbjgd"
origin: "https://www.linkedin.com"
tab:
active: true
audible: false
autoDiscardable: true
discarded: false
favIconUrl: "https://static-exp1.licdn.com/sc/h/1bt1uwq5akv756knzdj4l6cdc"
groupId: -1
height: 1329
highlighted: true
id: 466
incognito: false
index: 14
mutedInfo: {muted: false}
pinned: false
selected: true
status: "complete"
title: "(5) Yevhenii Babenko | LinkedIn"
url: "https://www.linkedin.com/in/yevhenii-babenko-2832811b4/"
width: 744
windowId: 112
*/