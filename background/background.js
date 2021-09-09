chrome.runtime.onInstalled.addListener(() => {
    console.log('bg onInstaled...')
})
// default value for setInterval 

const defaultTimeTnterval = 5000;
$(function () {
    setInterval(startRequest, 40000)
})

// fetch data and save to local storage
async function startRequest() {
    // alert('setInterval works')
    console.log('start Fetch request...');
    let url = 'https://jsonplaceholder.typicode.com/comments';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    addDataToLocalStorage(data);
}

function addDataToLocalStorage(data) {
    data.forEach(data => {
        if (localStorage.getItem(data.id)) {
            
        }
    });

    data.forEach(element => {
        localStorage.setItem(element.id, element.body)
    });
    localStorage.setItem('comments', data);
    console.log(localStorage.getItem('comments'))
}