document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded')
})

const btn = document.getElementById('checkPage');
btn.addEventListener('click', callback); 

btn.addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        console.log('current tab is: ', tabs[0])
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, {type: 'sendRequest'})
    })
})

function callback () {
    console.log('button was pressed')
}

/*
{active: true, audible: false, autoDiscardable: true, discarded: false, favIconUrl: "https://static-exp1.licdn.com/sc/h/1bt1uwq5akv756knzdj4l6cdc", …}
active: true
audible: false
autoDiscardable: true
discarded: false
favIconUrl: "https://static-exp1.licdn.com/sc/h/1bt1uwq5akv756knzdj4l6cdc"
groupId: -1
height: 929
highlighted: true
id: 447
incognito: false
index: 9
mutedInfo: {muted: false}
pinned: false
selected: true
status: "complete"
title: "(5) Feed | LinkedIn"
url: "https://www.linkedin.com/feed/"
width: 1042
windowId: 148
[[Prototype]]: Object
*/