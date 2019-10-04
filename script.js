//API TIME
// Client ID and API key from the Developer Console
var CLIENT_ID = '876421007454-57kv99rl11unaphq04oebfld8hd5f07p.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBbPGyC9lQY2C6vyPc_Zt6z2WItenpSijU';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
//On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
//Initializes the API client library and sets up sign-in state listeners.
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.

    // Handle the initial sign-in state.
  });
}
//Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
//Sign in the user upon button click.
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
//Sign out the user upon button click.
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  window.location.reload();
}
//Main body of code to be run after the client is authorized

function main(emerg) {
  let pit = createCaller("1yY2ewKcFxlc9Re5LGRfwP3Ui-EIH7iquP0-FeBeoJc8", "reports!A1:Z", "USER_ENTERED", "INSERT_ROWS"); //create caller is defined at the bottom of the page
  let d = new Date();
  if (emerg == "emergency") {
    pitValues=[["EMERGENCY", "EMERGENCY", "EMERGENCY", 5, "EMERGENCY", latitude, longitude, d.getDay()]];
  
  } else {
    pitValues=[[document.getElementById("name").value, document.getElementById("phone").value, document.getElementById("comments").value, document.getElementById("issue").value.charAt(0), document.getElementById("issue").value.slice(1), latitude, longitude, d.getDay()]];
  }
  pit(pitValues).then(response => console.log(response.result)).catch(err => console.log(err.result));
  window.location.reload()
  //Calls the google api to record values and resets form
}
/*
Curried function to create response generators
@param spreadsheetId The ID of the spreadsheet to update.
@param range The A1 notation of a range to search for a logical table of data.
@param valueInputOption How the input data should be interpreted. (RAW or USER_ENTERED)
@param insertDataOption How the input data should be inserted. (OVERWRITE or INSERT_ROWS)
@param values The spreadsheet values in nested array form.
*/
var createCaller = (spreadsheetId, range, valueInputOption, insertDataOption) => (values) => {
  var params = {
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: valueInputOption,
    insertDataOption, insertDataOption
  }
  var valueRangeBody = {
    values: values
  }
  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  return request;
}