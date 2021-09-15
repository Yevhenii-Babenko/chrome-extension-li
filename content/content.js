
console.log('content script works')

let currentUrl = window.location.href; 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('requests :', request)
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.type === 'retrieved_deprecated_userProfiles') {
   console.log(request.deprecatedUserProfiles)
   updateDeprecatedUserProfiles(request.deprecatedUserProfiles)
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
          alert(JSON.stringify(response))
      }))
    })
  }

  if(request.type === 'updataUserProfile'){
    alert('updataUserProfile')
  }
  return true;
})

function updateDeprecatedUserProfiles(deprecatedUserProfiles) {
  if (deprecatedUserProfiles.length !== 0 && deprecatedUserProfiles) {
    deprecatedUserProfiles.map(userProfile => {
      console.log(`${userProfile.firstName} ${userProfile.publicIdentifier}`)
      let id = userProfile.publicIdentifier;
      updateDprecatedProfiles(id)
    })
  }
}