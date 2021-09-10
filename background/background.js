chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
    setBusyTimeout(getAllUser, defaultTimeTnterval)
})

chrome.runtime.onStartup.addListener(function () {
    console.log('bg onStartup...');
    setBusyTimeout(getAllUser, defaultTimeTnterval);
})

chrome.runtime.onSuspend.addListener(function() {
    alert("Unloading...");
    clearTimeout(setBusyTimeout)
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
    //setInterval(getAllUser, 20000)
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