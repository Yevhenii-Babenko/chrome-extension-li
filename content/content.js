
console.log('content script works')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sendResponse.action === 'got_user_data') {
    console.log('got_user_data', true)
  } else {
    console.log('got_user_data', false)
  }
})

let getPublickProfileUrl = window.location.href;
// console.log('I wont to see profile url here:', getPublickProfileUrl); 

chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
  if (request.type === 'sendRequest') {
    console.log('request was sent - done!', request.type)
  }
  console.log('sender has a responce ?', sender)

  getUserLiByUrl(function (fetchUserData) {
    !fetchUserData ? console.log('can not get user profile') : chrome.runtime.sendMessage({
      type: 'post-user-data',
      candidateData: fetchUserData.elements
    }, (response => {
      console.log('this is a response on post-user-data', response, response.action)
        (response.action === 'got_user_data') ? setUpAlarm() : console.log('response.action is:', response.action)
    }))
  })

  // Content script doesn't have access to Alarms API => use messaging to bg.js to fire alarm
  // function setUpAlarm() {
  //   chrome.alarms.create('onResponceAlarm', { delayInMinutes: 0.1 })
  // }
  // chrome.alarms.addEventListener(alarms => {
  //   if (alarms && alarms.name === 'onResponceAlarm') {
  //     console.log('onResponceAlarm works - tada!')
  //   }
  // })
  function getUserLiByUrl(someFunction) {
    let cookiesLine = document.cookie;
    if (!cookiesLine) {
      console.log('there is not cookie')
    } else {
      // console.log('cookiesLine here', cookiesLine);
      let cookies = cookiesLine.split(";");
      let csrfToken = null;
      cookies.forEach(cookie => {
        if (cookie.includes("JSESSIONID")) {
          let keyToValue = cookie.split("=");
          csrfToken = keyToValue[1].replace(/"/g, "").trim();
          // console.log('I want to see clear - csrfToken :', csrfToken)
        }
      })
      const candidateId = getPublickProfileUrl();
      csrfToken ? loadData(candidateId, csrfToken, someFunction) : () => console.log('no csrfToken ');
    }
  }

  function loadData(candidateId, csrfToken, someFunction) {
    const fetchConfig = { headers: { 'csrf-token': csrfToken } };
    const url = "https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=" + candidateId + "&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-26";
    fetch(url, fetchConfig)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        someFunction(data);
      })
      .catch(err => console.log(err))
  }

  function getPublickProfileUrl() {
    let url = window.location.href;
    let encodedUrl = decodeURI(url);
    let id = encodedUrl.substring(encodedUrl.indexOf('in/') + 3, encodedUrl.length);

    if (id.includes("/")) {
      id = id.substring(0, id.indexOf("/"))
    }
    return id
  }
})