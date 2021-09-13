function getUserLiByUrl(someFunction) {
    let cookiesLine = document.cookie;
    if (!cookiesLine) {
      console.log('there is not cookie')
    } else {
      let cookies = cookiesLine.split(";");
      let csrfToken = null;
      cookies.forEach(cookie => {
        if (cookie.includes("JSESSIONID")) {
          let keyToValue = cookie.split("=");
          csrfToken = keyToValue[1].replace(/"/g, "").trim();
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
      .catch(err => console.error('error is : ', err))
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

  async function updateDprecatedProfiles(candidateId) {

    let cookies = cookiesLine.split(";");
    let csrfToken = null;
    cookies.forEach(cookie => {
      if (cookie.includes("JSESSIONID")) {
        let keyToValue = cookie.split("=");
        csrfToken = keyToValue[1].replace(/"/g, "").trim();
        }
    })
    const fetchConfig = { headers: { 'csrf-token': csrfToken } };
    try {
      const url = `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${candidateId}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-26`;
      const responce = await fetch(url, fetchConfig);
      const data = await responce.json();
      console.log('got data from deprecated profile: ', data)
    } catch (error) {
      console.error(error);
    }
  }