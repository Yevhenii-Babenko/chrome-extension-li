document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded')
})

const btn = document.getElementById('checkPage');
btn.addEventListener('click', callback);

btn.addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        // console.log('current tab is: ', tabs[0])
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { type: 'sendRequest' })
    })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request)
  })
  
function callback() {
    console.log('button was pressed')
}