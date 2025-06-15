// Create a window onload that runs the search button clicked
// function if the search element is clicked on event button.
window.onload = (e) => 
{
    document.querySelector("#search").onclick = SearchButtonClicked;
}

// Make an null variable.
let displayTerm = " ";

// Create a search button clicked function.
function SearchButtonClicked()
{
    // Inform that function is called.
    console.log("SearchButtonClicked() is called");

    // Get a public URL.
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    // Get the public API key.
    let GIPHY_KEY = "6jvjIyNA6L91JmtCljY34CnOoXTpWVWK";

    // Create an URL string.
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    // Get the user input search term and parse value.
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // Remove any white space in the searched term.
    term = term.trim();

    // Encode spaces and special character of term.
    term = encodeURIComponent(term);

    // If the term is null or less than one, return an empty character.
    if(term.length < 1)
    {
        return;
    }

    // Append the searched term to the URL address, '&q'.
    url += "&q=" + term;

    // Get the user chosen search limit.
    let limit = document.querySelector("#limit").value;
    
    // Add limit to URL using limit address, "&limit=".
    url += "&limit=" + limit;

    // Update the UI status to display loading search result text.
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // Check to see what the whole URL looks like.
    console.log(url);

    // Request the data using the get data function.
    GetData(url);
}

// Create a get data function.
function GetData(url)
{
    // Create a new XHR Object.
    let xhr = new XMLHttpRequest();

    // Set the onload handler on XHR object.
    xhr.onload = DataLoaded;

    // Set the onerror handler on XHR object.
    xhr.onerror = DataError;

    // Open a connection and send the request for XHR object.
    xhr.open("GET", url);
    xhr.send();
}

// Create call back event functions.
function DataError(e)
{
    // Print an error has occurred.
    console.log("An error has occurred");
}

function DataLoaded(e)
{
    // Get the event target, "which is the XHR object."
    let xhr = e.target;

    // Print the JSON .responseText file fro, the XHR object.
    console.log(xhr.responseText);

    // Convert the text to a parsable Javascript object.
    let obj = JSON.parse(xhr.responseText);

    // If there is no result, print message and return an empty value.
    if(!obj.data || obj.data.length === 0)
    {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    // Build an html string to display to user.
    let results = obj.data
    console.log("results.length = " + results.length);
    let bigString = `<p><i>Here are ${results.length} results for '${displayTerm}'</i></p>`;

    // Loop through the array of results.
    for(let i = 0; i < results.length; i++)
    {
        let result = results[i];

        // Get the URL to the gif.
        let smallURL = result.images.fixed_width_small.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        // Get the URL to the GIPHY page.
        let url = results.url;

        // Get the rating of the iletrated result.
        let rating = (result.rating ? result.rating: "NA").toUpperCase();

        // Build a <div> to hold each result using ES^ string templating.
        let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span>`;

        // Add the rating to line.
        line += `<p>Rating: ${rating}</p>`
        line += `</div>`;

        // Add the entire line to `bigString` and loop.
        bigString += line;
    }

    // Now show result to the user after building the HTML.
    document.querySelector("#content").innerHTML = bigString;

    // Update the status.
    document.querySelector("#status").innerHTML = "<b>Success!</b>";
}