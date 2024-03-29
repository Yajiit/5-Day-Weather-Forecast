// API Key from openweathermap
const apiKey = 'f18407f262d0ba6004701ffa48b7cccb';

const searchForm = document.getElementById('search-form');
  // sets forecastContainer to reference div container "weather-forecast" in HTML
  const forecastContainer = document.getElementById('weather-forecast');
  const searchHistoryContainer = document.getElementById('search-history');
// Event listener for form submission
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value;

  // Call the function to fetch weather forecast for the entered city
  fetchForecast(city);

      // Clear the input field after the search
      cityInput.value = '';
    });

      // Load and display the search history on page load
  const initialSearchHistory = localStorage.getItem('searchHistory');
  if (initialSearchHistory) {
    const parsedSearchHistory = JSON.parse(initialSearchHistory);
    displaySearchHistory(parsedSearchHistory);
    const mostRecentCity = parsedSearchHistory[0];
    // display most recently searched city on page load
  fetchForecast(mostRecentCity);
  }


  // Function to add the searched city to local storage
  function addCityToLocalStorage(city) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      // Remove the city if it already exists in the search history
      searchHistory = searchHistory.filter(item => item !== city);
      // Add the new city to the beginning of the search history array
      searchHistory.unshift(city);
      // Keep only the last 5 searches
      searchHistory = searchHistory.slice(0, 5);
    } else {
      searchHistory = [city];
    }

    // Save the updated search history to local storage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Display the search history as buttons
    displaySearchHistory(searchHistory);
  }

  // Function to display the search history as buttons
  function displaySearchHistory(searchHistory) {
    searchHistoryContainer.innerHTML = '';

    searchHistory.forEach(city => {
      const button = document.createElement('button');
      button.textContent = city;
      button.classList.add('btn', 'btn-secondary', 'mb-2', 'd-block');
      button.addEventListener('click', function() {
        fetchForecast(city);
      });

      searchHistoryContainer.appendChild(button);
    });
  }

  
// Function to fetch the forecast data
async function fetchForecast(city) {

  
  // Weather forecast API URL
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    // fetches the forecast for the chosen city and stores as "response"
    const response = await fetch(apiUrl);

    // parses the response w JSON and stores as "data"
    const data = await response.json();
    // puts parsed data into displayForecast function
    displayForecast(data);
    // Add the searched city to local storage
    addCityToLocalStorage(data.city.name);

    console.log(data)
  } catch (error) {
    // log for errors
    console.log('Error:', error);
  }
}



// Function to display the weather forecast to the div container
function displayForecast(data) {

  // clears any existing content of that div container
  forecastContainer.innerHTML = '';

  const weatherId = data.list[0].weather[0].id;
  const forecastsByDay = groupForecastsByDay(data.list);
  const currentDayForecast = forecastsByDay[0];
  const dailyForecasts = forecastsByDay.slice(1);
  const currentForecastCard = document.createElement('div');
  currentForecastCard.classList.add('forecast-current');
  currentForecastCard.innerHTML = `
    <h2>${data.city.name}</h2>
    <h3>${currentDayForecast.date}</h3>
    <p>Temperature: ${convertKelvinToFahrenheit(currentDayForecast.temperature)}°F </p>
    <p id="high">High: ${convertKelvinToFahrenheit(currentDayForecast.tempHigh)}°F </p>
    <p id="low">Low: ${convertKelvinToFahrenheit(currentDayForecast.tempLow)}°F </p>
    <p> Humidity: ${currentDayForecast.humidity}%</p>
    <p>Description: ${currentDayForecast.description}</p>
    <img src="https://openweathermap.org/img/w/${currentDayForecast.icon}.png" alt="${currentDayForecast.description}">
  `;

  changeBackgroundColor(weatherId);
  forecastContainer.appendChild(currentForecastCard);

  dailyForecasts.forEach(forecast => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
      <h3>${forecast.date}</h3>
      <p>Temps:</p>
      <p>${convertKelvinToFahrenheit(forecast.temperature)}°F </p>
      <p id="high">H: ${convertKelvinToFahrenheit(forecast.tempHigh)}°F </p>
      <p id="low">L: ${convertKelvinToFahrenheit(forecast.tempLow)}°F </p>
      <p> ${forecast.description}</p>
      <img src="https://openweathermap.org/img/w/${forecast.icon}.png" alt="${forecast.description}">
    `;
    // added the HTML to each 'card' with <h3> for time and a <p> for main temp, low temp, high temp, weath description, and icon each.
    forecastContainer.appendChild(forecastCard);
  });
}
// Function to group forecasts by day
function groupForecastsByDay(forecasts) {
  const forecastsByDay = {};
  forecasts.forEach(forecast => {
    const date = forecast.dt_txt.split(' ')[0]; // Extract the date part only
    if (!forecastsByDay[date]) {
      // if there's no forecast with the same date: pull the entire forecast
      forecastsByDay[date] = {
        date: date,
        temperature: forecast.main.temp,
        tempLow: forecast.main.temp_min,
        tempHigh: forecast.main.temp_max,
        description: forecast.weather[0].description,
        humidity: forecast.main.humidity,
        icon: forecast.weather[0].icon
      };
    } else {
      // if there is an existing forecast on that date, check if the high temperature is higher and display the highest
      const existingForecast = forecastsByDay[date];
      if (forecast.main.temp > existingForecast.tempHigh) {
        existingForecast.tempHigh = forecast.main.temp;
      }
      // if there is an existing forecast on that date, check if the low temperature is lower and display the lowest
      if (forecast.main.temp_min < existingForecast.tempLow) {
        existingForecast.tempLow = forecast.main.temp_min;
      }
    }
  });
  return Object.values(forecastsByDay);
}

// function to convert temperature from Kelvin to Fahrenheit
function convertKelvinToFahrenheit(temperature) {
  const fahrenheit = (temperature - 273.15) * 9/5 + 32;
  // cut off at tenth decimal
  return fahrenheit.toFixed(1);
}

function changeBackgroundColor(weatherId) {
  const body = document.body;

  if (weatherId >= 200 && weatherId <= 299) {
    // Thunderstorm colors
    body.style.backgroundColor = "#616C6F";
  } else if (weatherId >= 500 && weatherId <= 599) {
    // Rain colors
    body.style.backgroundColor = "#6B7A8F";
  } else if (weatherId >= 600 && weatherId <= 699) {
    // Snow colors
    body.style.backgroundColor = "#B3CDE0";
  } else if (weatherId === 701) {
    // Mist colors
    body.style.backgroundColor = "#A6A6A6";
  } else if (weatherId === 800) {
    // Clear colors
    body.style.backgroundColor = "#86BBD8";
  } else if (weatherId >= 801 && weatherId <= 809) {
    // Clouds colors
    body.style.backgroundColor = "#C5CED1";
  } else {
    // Default background color
    body.style.backgroundColor = "#FFFFFF";
  }
}
