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
    // puts parsed data into displayForecast function
    displayForecast(data);
  } catch (error) {
    // log for errors
    console.log('Error:', error);
  }
}

// Function to display the weather forecast to the div container
function displayForecast(data) {
  // sets forecastContainer to reference div container "weather-forecast" in HTML
  const forecastContainer = document.getElementById('weather-forecast');
  // clears any existing content of that div container
  forecastContainer.innerHTML = '';

  // Extract data for each forecast entry and stors as "forecasts"
  const forecasts = data.list.map(item => {
    return {
      date: item.dt_txt,
      temperature: item.main.temp,
      tempLow: item.main.temp_min,
      tempHigh: item.main.temp_max,
      description: item.weather[0].description,
      icon: item.weather[0].icon
      // grabs time, main temperature, low temperature, high temperature, a description of the weather, and an icon representing the weather forecast
    };
  });

  let row;
  // Create forecast cards and append them to the container
  forecasts.forEach((forecast, i) => {
    if (i % 4 === 0){
      row = document.createElement('div');
      row.classList.add('forecast-row');
    }

    // used forEach method to iterate over each 'forecast' in the array 'forecasts' [with an s]
    const card = document.createElement('div');
    // created 'card' element as a <div>
    card.classList.add('forecast-card');
    // added CSS styling class 'forecast-card' to each 'card' element
    card.innerHTML = `
      <h3>${forecast.date}</h3>
      <p>Temperature: ${forecast.temperature} </p>
      <p>Low: ${forecast.tempLow} </p>
      <p>High: ${forecast.tempHigh} </p>
      <p>Description: ${forecast.description}</p>
      <img src="https://openweathermap.org/img/w/${forecast.icon}.png" alt="${forecast.description}">
    `;
    // added the HTML to each 'card' with <h3> for time and a <p> for main temp, low temp, high temp, weath description, and icon each.
    row.appendChild(card);
    // appended the card to forecastContainer in the HTML document

    if ((i + 1) % 4 === 0 || i === forecasts.length - 1) {
      forecastContainer.appendChild(row);
    }
  });
}

// starts function
fetchForecast();