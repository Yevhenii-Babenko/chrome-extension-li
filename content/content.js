
console.log('content script works')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (sendResponse.action === 'got_user_data') {
  //   console.log('got_user_data', true)
  // } else {
  //   console.log('got_user_data', false)
  // }
})
let currentUrl = window.location.href; 

chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
  console.log('requests :', request)

  if (request.type === 'sendRequest' && currentUrl.includes('in/')) {
    console.log('request was sent - done!', request.type)
    getUserLiByUrl(function (fetchUserData) {
      !fetchUserData ? console.log('can not get user profile') : chrome.runtime.sendMessage({
        type: 'post-user-data',
        candidateData: fetchUserData.elements
      }, (response => {
        // console.log('this is a response on post-user-data', response, response.action)
          alert(response)
      }))
    })
}

  if(request.type === 'updataUserProfile'){
    alert('updataUserProfile')
  }
})