chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
    // setBusyTimeout(getAllUser, defaultTimeTnterval)
    chrome.tabs.getAllInWindow(null, function(tabs) {
        for(let i = 0; i < tabs.length; i++) {

            let url = tabs[i].url;
  
            if (url.indexOf("linkedin") !== -1) {
                console.log(url)
                chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
            }
        }
    })
})

// func find tab which includes "linkedin" and send message
chrome.tabs.query({currentWindow: true}, function(tabs) {
    const allTabs = [...tabs];
    console.log('allTabs', allTabs);
    allTabs.map((element, index) => {
        if (Object.values(element).some(item => typeof item === 'string' && item.includes('linkedin'))) {
            console.log(element, index);
            // chrome.tabs.sendMessage(tabs[index].id, {greeting: "hello"}, function(response) {
            // console.log(response);
            // });
            chrome.tabs.sendMessage(tabs[index].id, {greeting: "hello"})
        } else {
            console.log('this is ... f*c')
        }
    });
});

chrome.runtime.onStartup.addListener(function () {
    console.log('bg onStartup...');
    // setBusyTimeout(getAllUser, defaultTimeTnterval);
})

chrome.runtime.onSuspend.addListener(function() {
    alert("Unloading...");
    // clearTimeout(setBusyTimeout)
})

var SAFE_DELAY = 1000; // Guaranteed not to fall asleep in this interval

const setBusyTimeout = function (callback, delay) {
  if(delay <= SAFE_DELAY) {
    setTimeout(callback, delay);
  } else {
    var start = Date.now(); // setTimeout drifts, this prevents accumulation
    setTimeout(
      function() {
        setBusyTimeout(callback, delay - (Date.now() - start));
      }, SAFE_DELAY
    );
  }
  // Can be expanded to be cancellable by maintaining a mapping
  //   of "busy timeout IDs" to real timeoutIds
}

const url = 'https://jsonplaceholder.typicode.com';
// default value for setInterval 

const defaultTimeTnterval = 5000;
$(function () {
    // setInterval(startRequest, 40000)
    // setInterval(getAllUser, 20000)
    // setTimeout(updateUserDeprecatedProfile, 10000)
})

function getAllUser() {
    fetch(url + '/users')
        .then(function (response){
            return response.json()
        })
        .then(function (data) {
            setUsersToStore(data)
        })
        .catch(function (error) {
            console.log(error)
        })
}

function setUsersToStore(users) {
    let keys = Object.keys(localStorage)
    console.log(keys)

    // add a user list if localStorage is empty
    if(!keys.includes('listOfUsers')) {
        localStorage.setItem('listOfUsers', JSON.stringify(users));
        alert('added new data to localStore')
    }

    // check if there are users into the Storage
    keys.includes('listOfUsers') ? getUsersFromStorage('listOfUsers') : console.log('There is not users into the Storage');
}

function getUsersFromStorage(key) {
    const users = JSON.parse(localStorage.getItem(key))
    users.forEach(user => {
        const userId = user.id;
        getSingleUser(userId)
    });
}

function getSingleUser(userId) {
    fetch(url + `/users/${userId}`)
    .then(function (responce) {
        return responce.json()
    })
    .then(function(data){
        patchUserInfo(data)
    })
    .catch(function (error){
        console.error('error', error);
    })
}

function patchUserInfo(userData){
    console.log('this is from patchUserInfo', userData)
    const id = userData.id
    // console.log(userData.name, userData.username)
    fetch(`${url}/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: `${userData.name + 1}`,
            username: `${userData.username + 1}`
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(function(responce) {
        responce.json()
    })
    .then(function(json) {
        console.log('this is a responce of PATCH: ', json)
    })
    .catch(function(error) {
        console.error('error', error);
    })
}

function getUserProfileData(userProfile) {
    let keys = Object.keys(localStorage);
    // check if lokalStorage has key('liUserProfile') 
    if(!keys.includes('liUserProfile')) {
        localStorage.setItem('liUserProfile', JSON.stringify(userProfile));
        userProfile.forEach(item => {
            // localStorage.setItem('liUserProfile', item)
            console.log(item)
        })
    };
}

if(localStorage.getItem('listOfUsers')) {
    chrome.tabs.query({currentWindow: true, active: true }, 
        function(tabs){
            const currentTab = tabs[0];
            console.log('currentTab', currentTab)
            chrome.tabs.sendMessage(currentTab.id, {type: "need_to_update_profiles"})
    })
}

function getUserDataFromLockalStorage () {
    const userData = JSON.parse(localStorage.getItem('liUserProfile'));
    console.log('userData from local storage', userData);
    const userId = userData[0].publicIdentifier;
    console.log('publicIdentifier:', userId);
    return userId;
}

// function updateUserDeprecatedProfile() {
//     // getUserDataFromLockalStorage();
//     try {
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
//             chrome.tabs.sendMessage(tabs[0].id,
//                 {
//                     type: "need_to_update_deprecated_profiles",
//                     deprUserId: getUserDataFromLockalStorage
//                 },
//                 function(response) {
//                 if(chrome.runtime.lastError) {
//                     console.error(chrome.runtime.lastError.message);
//                     return;
//                 };
//                 console.log(response)
//             }); 
//           });
//     } catch (error) {
//         console.error(error);
//     }
//     // chrome.tabs.query({currentWindow: true, active: true }, 
//     //     function(tabs){
//     //         const currentTab = tabs[0];
//     //         console.log('currentTab', currentTab)
//     //         chrome.tabs.sendMessage(currentTab.id, {
//     //             type: "need_to_update_deprecated_profiles",
//     //             deprUserId: getUserDataFromLockalStorage
//     //         })
//     // })
// }