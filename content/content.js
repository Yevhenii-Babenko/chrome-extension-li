
console.log('content script works')

let currentUrl = window.location.href; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('requests :', request)
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.greeting == "hello")
  sendResponse({farewell: "goodbye"});


  if (request.type === "hello") {
    alert("hello")
  }
  if (request.type === "need_to_update_profiles") {
    alert('need_to_update_profiles')
  }
  if (request.type === 'sendRequest' && currentUrl.includes('in/')) {
    console.log('request was sent - done!', request.type)
    getUserLiByUrl(function (fetchUserData) {
      !fetchUserData ? console.log('can not get user profile') : chrome.runtime.sendMessage({
        type: 'post-user-data',
        candidateData: fetchUserData.elements
      }, (response => {
        // console.log('this is a response on post-user-data', response, response.action)
          alert(JSON.stringify(response))
      }))
    })
    return true;
}

  if(request.type === 'updataUserProfile'){
    alert('updataUserProfile')
  }
})

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});