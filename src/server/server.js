// Setup empty JS object to act as endpoint for all routes
projectData = {};
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Set port
const port = 3000;
// Spin up the server
const server = app.listen(port, listening);
// Callback to debug
function listening(){
  console.log(`running on localhost: ${port}`);
};

// Initialize all route with a callback function
app.get('/all', sendData);

// Callback function to complete GET '/all'
function sendData (request, response) {
  response.send(projectData);
};

app.post('/add', (request, response)=>{
  let data = request.body;

  // Create new entry for JS Object Endpoint
  /* 
   * Dependant on what data the student chose
   * at a min, there should be some sort of date till trip, a latitude,
   * a longitude, a high temperature, low temperature, and a teriary 
   * piece of weather data
  */
  projectData["daysToTrip"] = data.daysToTrip;
  projectData["lat"] = data.lat;
  projectData["long"] = data.long;
  projectData["countryCode"] = data.countryCode;
  projectData["tempHigh"] = data.tempHigh;
  projectData["tempLow"] = data.tempLow;
  projectData["summary"] = data.summary;
  projectData["tripImage"] = data.imageURL;

  // Send response to Endpoint
  response.send(projectData);
})