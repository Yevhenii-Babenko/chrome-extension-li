chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
    // create alarms after extension is instaled / upraded
    scheduleRequest();
    // scheduleWhatchLog();
    // startRequest();
    chrome.alarms.clear('watchlog')
    chrome.alarms.getAll(alarms => console.log(alarms))
})

function onCleaAlarm(wasCleared) {
    console.log(wasCleared)
}
let commentsStore = [];

chrome.runtime.onStartup.addListener(() => {
    //  fetch and save data when chrome restarted    
    console.log('onStartup');
    // startRequest();
})

chrome.runtime.onSuspend.addListener(() => {
    chrome.alarms.clearAll('watchlog', 'refresh')
})

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { text: 'hello' })
    console.log('background btn action')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getPost') {
        sendResponse('you need to save data to postStore')
    }
    if (request.type === 'post-user-data') {
        console.log('post-user-data equal to', request)
        sendResponse()
    }
})

chrome.alarms.onAlarm.addListener(alarms => {
    (alarms && alarms.name === 'fetch_comments') ? startRequest() : console.log('does not working')
})
// chrome.alarms.onAlarm.addListener(alarm => {
//     if (alarm && alarm.name === 'watchlog') {
//         chrome.alarms.get('refresh', alarm => {
//             if (alarm) {
//                 console.log('refresh alarm exists')
//             } else {
//                 // if it is not there, sratt a new request and reschedule refresh alarm
//                 console.log('refresh alarm doesn not exist, start a ne alerm')
//                 startRequest();
//                 scheduleRequest();
//             }
//         })
//     } else {
//         // if refresh alarm triggered, start a new request
//         startRequest();
//     }
// })

function scheduleRequest() {
    console.log('schedule etch_comments - delayInMinutes: 0.1');
    chrome.alarms.create('fetch_comments', { delayInMinutes: 0.1 });
}

// schedule a whatchlog check every 2mins
function scheduleWhatchLog() {
    console.log('schedule whatchlog alarm to 2 minutes');
    chrome.alarms.create('whatchlog', { periodInMinutes: 2 })
}

// fetch data and save to local storage
async function startRequest() {
    console.log('start Fetch request...');
    let url = 'https://jsonplaceholder.typicode.com/comments';
    const response = await fetch(url);
    const data = await response.json();
    addData(data);
}

function addData(comments){
    postStore = comments;
    console.log(postStore)
}