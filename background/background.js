chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
    // setInterval(getAllUser, 60000)
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

function sendMessFromTabs(fetchedUsersData) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
        for(let i = 0; i < tabs.length; i++) {
    
            let url = tabs[i].url;
    
            if (url.indexOf("linkedin") !== -1) {
                console.log('url from getWinds', url)
                chrome.tabs.sendMessage(tabs[i].id, {
                    type: 'hey!!!',
                    userData: fetchedUsersData
                });
            } else {
                console.log('there no tab with linkedin')
            }
        }
    })
}

chrome.runtime.onStartup.addListener(function () {
    console.log('bg onStartup...');
    // setBusyTimeout(getAllUser, defaultTimeTnterval);
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
    // getLinkedinUserData();
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
    if(!keys.includes('listOfUsers')) {
        localStorage.setItem('listOfUsers', JSON.stringify(users));
        console.log('listOfUsers');
    } else {
        const previousUsers = JSON.parse(localStorage.getItem('listOfUsers'));
        const addUsers = [...previousUsers, users];
        localStorage.setItem('listOfUsers', addUsers)
    }
    let data = JSON.parse(localStorage.getItem('listOfUsers'))
    // sendMessFromTabs(data)
    // setTimeout(function () {
    //     localStorage.removeItem('listOfUsers')
    // }, 2000);
    // check if there are users into the Storage
    // keys.includes('listOfUsers') ? getUsersFromStorage('listOfUsers') : console.log('There is not users into the Storage');
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

    if(!keys.includes('liUserProfile')) {
        localStorage.setItem('liUserProfile', JSON.stringify(userProfile));
        console.log(localStorage.getItem('created new liUserProfile', 'liUserProfile'))
    } else {
        const previousUserProfile = JSON.parse(localStorage.getItem('liUserProfile'));
        let addUserProfiles = [...previousUserProfile, userProfile[0]]
        localStorage.setItem('liUserProfile', JSON.stringify(addUserProfiles))
    }
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


async function getLinkedinUserData() {
    const csrfToken = "ajax:5480537748970621473";
    const candidateId = "yevhenii-babenko-2832811b4";
    const url = `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${candidateId}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-26`;
    const fetchConfig = { headers: { 'csrf-token': csrfToken } };
    try {
        const response = await fetch(url, fetchConfig);
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error('error is:', error);
    }
}

// function getLinkedCandidateId(candidateData) {
//     let id;
//     // candidateData ? id = candidateData.publicIdentifier : id = null;
//     if (candidateData) {
//         candidateData.map((item) => id = item.publicIdentifier)
//     }
//     return id
// }


/*
candidateData: Array(1)
0:
$recipeType: "com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities"
backgroundPicture: {originalImageReference: {…}, originalImageUrn: 'urn:li:digitalmediaAsset:C4D04AQFoxyWqkd154A', displayImageReference: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.OriginalAndDisplayImage', displayImageUrn: 'urn:li:digitalmediaAsset:C4D16AQF655rRQ0jdCw', …}
educationOnProfileTopCardShown: true
entityUrn: "urn:li:fsd_profile:ACoAADHfqEMBK5N-VPiuSlcqCVmrVvcLA-YijFs"
firstName: "Yevhenii"
geoLocation: {geo: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.ProfileGeoLocation', geoUrn: 'urn:li:fsd_geo:105088134', postalCode: '81300'}
geoLocationBackfilled: false
headline: "Trainee/junior Front-end developer (angular, react)"
industry: {name: 'Computer Software', $recipeType: 'com.linkedin.voyager.dash.deco.common.Industry'}
industryUrn: "urn:li:fsd_industry:4"
lastName: "Babenko"
location: {countryCode: 'ua', postalCode: '81300'}
multiLocaleFirstName: {ru_RU: 'Yevhenii'}
multiLocaleHeadline: {ru_RU: 'Trainee/junior Front-end developer (angular, react)'}
multiLocaleLastName: {ru_RU: 'Babenko'}
objectUrn: "urn:li:member:836741187"
primaryLocale: {country: 'RU', language: 'ru', $anti_abuse_annotations: Array(2)}
profileCertifications: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileCertifications', elements: Array(0)}
profileCourses: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileCourses', elements: Array(0)}
profileEducations: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileEducations', elements: Array(0)}
profileHonors: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileHonors', elements: Array(0)}
profileLanguages: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileLanguages', elements: Array(0)}
profileOrganizations: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileOrganizations', elements: Array(0)}
profilePatents: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfilePatents', elements: Array(0)}
profilePicture: {originalImageReference: {…}, originalImageUrn: 'urn:li:digitalmediaAsset:C4D04AQGyHVr2xnvUpQ', displayImageReference: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.OriginalAndDisplayImage', displayImageUrn: 'urn:li:digitalmediaAsset:C4D03AQFrcwkH07jteg', …}
profilePositionGroups: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfilePositionGroups', elements: Array(1)}
profileProjects: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileProjects', elements: Array(0)}
profilePublications: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfilePublications', elements: Array(0)}
profileSkills: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileSkills', elements: Array(0)}
profileTestScores: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileTestScores', elements: Array(0)}
profileTreasuryMediaProfile: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileTreasuryMediaItems', elements: Array(0)}
profileVolunteerExperiences: {paging: {…}, $recipeType: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileVolunteerExperiences', elements: Array(0)}
publicIdentifier: "yevhenii-babenko-2832811b4"
supportedLocales: [{…}]
trackingId: "SIv4qaHhTGSreRFjvXZWzw=="
versionTag: "636497397"
[[Prototype]]: Object
length: 1
[[Prototype]]: Array(0)
type: "post-user-data"
[[Prototype]]: Object
background.js:95 
*/