chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
    // create alarms after extension is instaled / upraded
    scheduleRequest();
    scheduleWhatchLog();
    startRequest();
})

chrome.runtime.onStartup.addListener(() => {
    //  fetch and save data when chrome restarted    
    console.log('onStartup');
    startRequest();
})

chrome.runtime.onSuspend.addListener(() => {
    chrome.alarms.clearAll('watchlog', 'refresh')
})

console.log('background is runnig');
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { text: 'hello' })
    console.log('background btn action')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getPost') {
        console.log('you need to save data to postStore')
    }
})


chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm && alarm.name === 'watchlog') {
        chrome.alarms.get('refresh', alarm => {
            if (alarm) {
                console.log('refresh alarm exists')
            } else {
                // if it is not there, sratt a new request and reschedule refresh alarm
                console.log('refresh alarm doesn not exist, start a ne alerm')
                startRequest();
                scheduleRequest();
            }
        })
    } else {
        // if refresh alarm triggered, start a new request
        startRequest();
    }
})

function scheduleRequest() {
    console.log('schedule request alarm to 3 minutes');
    chrome.alarms.create('watchlog', { periodInMinutes: 3 });
}

// schedule a whatchlog check every 2mins
function scheduleWhatchLog() {
    console.log('schedule whatchlog alarm to 2 minutes');
    chrome.alarms.create('whatchlog', { periodInMinutes: 2 })
}

// fetch data and save to local storage
async function startRequest() {
    console.log('start Fetch request...')
    let url = 'https://jsonplaceholder.typicode.com/comments';
    await fetch(url)
        .then(responce => responce.json())
        .then(json => console.log(json))
}