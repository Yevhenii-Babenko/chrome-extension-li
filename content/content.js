
console.log('content script works')

let getPublickProfileUrl = window.location.href;
console.log('I wont to see profile url here:', getPublickProfileUrl); 

chrome.runtime.onMessage.addListener((request, sender, sendResponce )=> {
  if (request.type === 'sendRequest') {
    console.log('request was sent - done!')
    let cookiesLine = document.cookie;
    if(!cookiesLine) {
        console.log('there is not cookie')
    } else {
        console.log('cookiesLine here', cookiesLine);
        let cookies = cookiesLine.split(";");
        let csrfToken = null;
        cookies.forEach(cookie => {
          if (cookie.includes("JSESSIONID")){
            let keyToValue = cookie.split("=");
            csrfToken = keyToValue[1].replace(/"/g, "").trim();
            console.log('I want to see clear - csrfToken :', csrfToken)
          }
        })
        const candidateId = getPublickProfileUrl();
        csrfToken ? loadData(candidateId, csrfToken ) : () => console.log('no csrfToken ');
      }
  }
  function loadData(candidateId, csrfToken) {
    const fetchConfig = { headers: {'csrf-token': csrfToken} };
    const url = "https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=" + candidateId + "&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-26";
    fetch(url, fetchConfig)
      .then(response => response.json()).then(data => console.log(data)).catch(err => console.log(err))
    // $.ajax({
    //   url: `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${candidateId}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-26`,
    //   xhrFields: {
    //     withCredentials: false
    //   },
    //   headers: {
    //     "csrf-token": csrfToken,
    //   },
    //   type: "GET",
    //   success: function() {
    //     console.log('now it is work, fine!')
    //   },
    //   error: function () {
    //     console.log('CANT_LOAD_PROFILE');
    //   }
    // })
  }
  function getPublickProfileUrl() {
    let url = window.location.href;
    let encodedUrl = decodeURI(url);
    let id = encodedUrl.substring(encodedUrl.indexOf('in/') + 3, encodedUrl.length);

    if(id.includes("/")) {
      id = id.substring(0, id.indexOf("/"))
    }
    return id
  }

  fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(json => console.log(json))
})