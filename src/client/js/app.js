//if(typeof document !== "undefined");

// if student chooses to use country for pixabay, they will likely use country list node module
const { getName } = require('country-list');

// Personal API Key for geonames API
const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename=';
const apiKey = '&maxRows=1&username=rachymm';

// Personal API Key for darksky API
const dsBaseURL = 'https://api.darksky.net/forecast/';
const dsApiKey = '23e7949bcd7286c080f22a54a081278a';

// Personal API Key for pixabay API
const pbBaseURL = 'https://pixabay.com/api/';
const pbApiKey = '1097068-058c8302590a825a864607bc6';

// create default trip object
let myTrip = { daysToTrip: 0, lat:0, long:0, country:'US', tempHigh:0, tempLow: 0, summary: '', imageURL: ''};

// main function exported to index.js and called by event listener
const mainFunction = () => {
  performStep1();
}

// Step 3, get image. Called by step 2
const performStep3 = () => {
  // Retrieve the location entered by the user via the DOM 
  // input element with the ID 'location' -- NOTE: may be in a global variable 
  let searchTermOg = document.getElementById('location').value;
  // Replaces spaces with + for url as per pixabay documentation
  let searchTerm = searchTermOg.replace(' ', '+');
  // Fetch api
  getImage(pbBaseURL, searchTerm, pbApiKey)
  .then(function(data){
    // Update myTrip Object
    myTrip.imageURL = data.hits[0].webformatURL;

    // Post complete myTrip Object to express server
    postData('/add', myTrip);
    // Retrieve Data from server to display on index.html
    retrieveData();
    }
  )
}

// Step 2, get weather. Called by step 1
const performStep2 = (latitude, longitude) => {
  // Retrieve the travel date entered by the user via the DOM 
  // input element with the ID 'travel-date' -- NOTE: may be in a global variable 
  let countDownDate = new Date(document.getElementById('travel-date').value).getTime();
  // Devide by 1000 to remove excess 0s
  const date = countDownDate / 1000;
  // Fetch api
  getWeather(dsBaseURL, latitude, longitude, date, dsApiKey)
  .then(function(data){
    // Update myTrip Object
    myTrip.summary = data.daily.data[0].summary;
    myTrip.tempHigh = data.daily.data[0].temperatureHigh;
    myTrip.tempLow = data.daily.data[0].temperatureLow;

    // Step 3 callback
    performStep3();
    }
  )
  
}

// Step 1, get location. Called by mainFunction
const performStep1 = () => {
  // Retrieve the location entered by the user via the DOM 
  // input element with the ID 'location' -- NOTE: may be in a global variable 
  let location = document.getElementById('location').value;
  // Fetch api
  console.log(location);
  getLocation(baseURL, location, apiKey)
  .then(function(data){
    // Update myTrip Object
    myTrip.daysToTrip = countDown();
    myTrip.lat = data.postalCodes[0].lat;
    myTrip.long = data.postalCodes[0].lng;
    // Converting country code to country for img alt tag
    // Not a requirement, just a possibility
    myTrip.countryCode = getName(data.postalCodes[0].countryCode);
    // Ensure data has been retrieved before step 2 call back
    
    if(data.length !== 0 ){
      // Step 2 callback
      performStep2(myTrip.lat, myTrip.long);
    }
  })
}

/* Functions to GET Web API Data */
const getLocation = async (baseURL, location, key)=>{
    // Use the fetch API to retrieve the lat/lon from the user's entered location
    const res = await fetch(baseURL+location+key);
    try {
      const data = await res.json();
        return data;
    } catch(error) {
      console.log('error', error);
    }
}

// Helper function for countdown used in getWeather function
const countDown = () => {
  let countDownDate = new Date(document.getElementById('travel-date').value).getTime();
  console.log(countDownDate);
  // Get today's date and time
  const now = new Date().getTime();
  // Find the distance between now and the count down date
  const distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24)) + 1;
  return days;
}

const getWeather = async (dsBaseURL, latitude, longitude, travelDate, key)=>{
  let completURL;
  // if travel date is further than 1 week out, get predicted data
  if (countDown() > 7){
    // use herokuapp prefix to solve cors issues
    completURL = `https://cors-anywhere.herokuapp.com/${dsBaseURL}${key}/${latitude},${longitude},${travelDate}`;
  } else {
  // if travel date is within the week, get day's forecast
    completURL = `https://cors-anywhere.herokuapp.com/${dsBaseURL}${key}/${latitude},${longitude}`;
  }
  // Use the fetch API to retrieve the current weather based on lat/long and travel date
  const res = await fetch(completURL)
  try {
    const data = await res.json();
      return data;
  } catch(error) {
    console.log('error', error);
  }
}

const getImage = async (pbBaseURL, searchTerm, key)=>{
  let completURL = `https://cors-anywhere.herokuapp.com/${pbBaseURL}?key=${key}&q=${searchTerm}&image_type=photo`
  // Use the fetch API to retrieve an image based on what the user entered
  const res = await fetch(completURL)
  try {
    const data = await res.json();
      return data;
  } catch(error) {
    console.log('error', error);
  }
}

/* Function to POST data NOTE: unchanged from project 3*/
const postData = async ( url = '', data = {} )=>{
  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),        
  });
  try {
    const newData = await response.json();
    return newData;
  } catch(error) {
    console.log('error', error);
  }
}

/* Function to GET Project Data */
const retrieveData = async () => { 
  const request = await fetch('/all');
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    let tripInfo = `<p>There was an error with your trip, please try again.</p>`;
    let tripWeather =`<p>There is no weather to display</p>`;
    let tripImage = `<img src="${allData.tripImage}" alt="${allData.countryCode}">`;
    console.log(tripImage);
    // Display different messages based on how soon trip is. 
    if (allData.daysToTrip < 0){
      tripInfo = `<p>Your Trip has expired.</p>`;
    } else if (allData.daysToTrip == 0){
      tripInfo = `<p>Your Trip starts today! </p>`;
      tripWeather =`<p>Todays Weather is: <span><br>High - ${allData.tempHigh}, Low - ${allData.tempLow} <br>Summary - ${allData.summary}</span></p>`;
    } else if (allData.daysToTrip <= 7){
      tripInfo = `<p>Your Trip is coming up this week in ${allData.daysToTrip} days!</p>`;
      tripWeather =`<p>Todays Weather is: <span><br>High - ${allData.tempHigh}, Low - ${allData.tempLow} <br>Summary - ${allData.summary}</span></p>`;
    } else {
      tripInfo = `<p>Your Trip is in ${allData.daysToTrip} days!</p>`;
      tripWeather =`<p>Typicacl weather for then is: <span><br>High - ${allData.tempHigh}, Low - ${allData.tempLow} <br>Summary - ${allData.summary}</span></p>`;
    }

    document.getElementById('date').innerHTML = tripInfo;
    document.getElementById('image').innerHTML = tripImage;
    document.getElementById('weather').innerHTML = tripWeather;
    
  }
  catch(error) {
    console.log('error', error);
  }
}

const clearTrip = () => {
  document.getElementById('location').value = "";
  document.getElementById('travel-date').value = "";
  document.getElementById('date').innerHTML = "";
  document.getElementById('image').innerHTML = "";
  document.getElementById('weather').innerHTML = "";
}

// export function for index.js
export { mainFunction, clearTrip }
