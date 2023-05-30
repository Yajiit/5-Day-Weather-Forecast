// API Key from openweathermap
const apiKey = 'f18407f262d0ba6004701ffa48b7cccb';
// City to get weather for
const city = 'Phoenix';

// Weather forecast API URL
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

// Function to fetch the forecast data
async function fetchForecast() {
  try {
    // fetches the forecast for the chosen city and stores as "response"
    const response = await fetch(apiUrl);
    // parses the response w JSON and stores as "data"
    const data = await response.json();
    // puts parsed data in console
    console.log(data);
  } catch (error) {
    // log for errors
    console.log('Error:', error);
  }
}
fetchForecast()