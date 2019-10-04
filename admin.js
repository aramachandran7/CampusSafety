function getValues() {
  function authComplete() {
    const pocGetCaller = createGetCaller("1yY2ewKcFxlc9Re5LGRfwP3Ui-EIH7iquP0-FeBeoJc8");
    let testingRequest = pocGetCaller("reports!A2:Z"); //Possibly delete all this later, just running through all the functions
    testingRequest.then(response => {
      
      var valuesArray = response.result.values;

      sorted = []
      valuesArray.forEach((element)=>{
          sorted.push(element)
      })


      sorted = sorted.sort(function(a,b) {
          return a[3]-b[3]
      })

      date = new Date();
      for (i = 0; i < sorted.length; i++) {
        if (sorted[i][7] != date.getDay()) {
          sorted.splice(i, 1)
          i--
        }
      };
      var table = document.getElementById("reportTable")     

      for (i = sorted.length-1; i >= 0; i--) { 
        currentRow = table.insertRow(sorted.length-i);
        eval("var lat" + i + " = " + sorted[i][5])
        eval("var long" + i + " = " + sorted[i][6])
        eval("var addr" + i + " = '" + sorted[i][8] + "'")
        currentRow.setAttribute("onclick", "getOnclick('" + eval("lat" + i) + "', '" + eval("long" + i) +  "', '" + eval("addr" + i) + "')")
        

        table.rows[sorted.length-i].insertCell(0).innerHTML = sorted[i][0]
        table.rows[sorted.length-i].insertCell(1).innerHTML = sorted[i][1]
        table.rows[sorted.length-i].insertCell(2).innerHTML = sorted[i][2]
        table.rows[sorted.length-i].insertCell(3).innerHTML = sorted[i][3]
        table.rows[sorted.length-i].insertCell(4).innerHTML = sorted[i][4]
        table.rows[sorted.length-i].insertCell(5).innerHTML = sorted[i][5]
        table.rows[sorted.length-i].insertCell(6).innerHTML = sorted[i][6]
      }

      var table = document.getElementById("allReportTable")
      for (i = valuesArray.length-1; i >= 0; i--) { 
        table.insertRow(valuesArray.length-i);
        table.rows[valuesArray.length-i].insertCell(0).innerHTML = valuesArray[i][0]
        table.rows[valuesArray.length-i].insertCell(1).innerHTML = valuesArray[i][1]
        table.rows[valuesArray.length-i].insertCell(2).innerHTML = valuesArray[i][2]
        table.rows[valuesArray.length-i].insertCell(3).innerHTML = valuesArray[i][3]
        table.rows[valuesArray.length-i].insertCell(4).innerHTML = valuesArray[i][4]
        table.rows[valuesArray.length-i].insertCell(5).innerHTML = valuesArray[i][5]
        table.rows[valuesArray.length-i].insertCell(6).innerHTML = valuesArray[i][6]
      }
    })
  }
  var googleAuth = gapi.auth2.getAuthInstance();
  if (googleAuth.isSignedIn.get() === true) {
    authComplete()
  } else {
    googleAuth.signIn()
    googleAuth.isSignedIn.listen(authComplete)
  }
}

/**************** API **********************************/

// Client ID and API key from the Developer Console
var CLIENT_ID = '876421007454-57kv99rl11unaphq04oebfld8hd5f07p.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBbPGyC9lQY2C6vyPc_Zt6z2WItenpSijU';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);

}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  var authorizeButton = document.getElementById('authorize-button');
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  var authorizeButton = document.getElementById('authorize-button');
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    getValues();
  } else {
    authorizeButton.style.display = 'block';
  }
}

/**
 *    Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  window.location.reload();
}



/**
*   Curried function to create response generators
*   @param spreadsheetId The ID of the spreadsheet to update.
*
*   @param range The A1 notation of a range to search for a logical table of data.
*/

let createGetCaller = (spreadsheetId) => (range) => {
  let params = {
    spreadsheetId: spreadsheetId,
    range: range
  }
  let request = gapi.client.sheets.spreadsheets.values.get(params);
  return request;
}

const createCaller = (spreadsheetId, range, valueInputOption, insertDataOption) => (values) => {
  let params = {
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: valueInputOption,
    insertDataOption, insertDataOption
  }
  let valueRangeBody = {
    values: values
  }
  let request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  return request;
}

const createClearCaller = (spreadsheetId) => (range) => {
  let params = {
    spreadsheetId: spreadsheetId,
    range: range
  }
  let request = gapi.client.sheets.spreadsheets.values.clear(params);
  return request;
}
/**************************** END API ************************/