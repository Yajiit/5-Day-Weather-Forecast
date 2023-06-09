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
      // Add the searched city to local storage
      addCityToLocalStorage(city);

      // Clear the input field after the search
      cityInput.value = '';
    });

      // Load and display the search history on page load
  const initialSearchHistory = localStorage.getItem('searchHistory');
  if (initialSearchHistory) {
    const parsedSearchHistory = JSON.parse(initialSearchHistory);
    displaySearchHistory(parsedSearchHistory);
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
  } catch (error) {
    // log for errors
    console.log('Error:', error);
  }
}



// Function to display the weather forecast to the div container
function displayForecast(data) {

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

// window.onload = function() {
//   // Event listener for form submission
//   searchForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     const cityInput = document.getElementById('city-input');
//     const city = cityInput.value;

//     // Call the function to fetch weather forecast for the entered city
//     fetchForecast(city);

//     // Add the searched city to local storage
//     addCityToLocalStorage(city);

//     // Clear the input field after the search
//     cityInput.value = '';
//   });

//   // Function to fetch the forecast data
//   async function fetchForecast(city) {
//     // Weather forecast API URL
//     const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
//     try {
//       // Fetches the forecast for the chosen city and stores it as "response"
//       const response = await fetch(apiUrl);
//       // Parses the response as JSON and stores it as "data"
//       const data = await response.json();
//       // Puts the parsed data into the displayForecast function
//       displayForecast(data);
//     } catch (error) {
//       // Log any errors
//       console.log('Error:', error);
//     }
//   }

//   // Function to add the searched city to local storage
//   function addCityToLocalStorage(city) {
//     let searchHistory = localStorage.getItem('searchHistory');
//     if (searchHistory) {
//       searchHistory = JSON.parse(searchHistory);
//       // Remove the city if it already exists in the search history
//       searchHistory = searchHistory.filter(item => item !== city);
//       // Add the new city to the beginning of the search history array
//       searchHistory.unshift(city);
//       // Keep only the last 5 searches
//       searchHistory = searchHistory.slice(0, 5);
//     } else {
//       searchHistory = [city];
//     }

//     // Save the updated search history to local storage
//     localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

//     // Display the search history as buttons
//     displaySearchHistory(searchHistory);
//   }

//   // Function to display the search history as buttons
//   function displaySearchHistory(searchHistory) {
//     searchHistoryContainer.innerHTML = '';

//     searchHistory.forEach(city => {
//       const button = document.createElement('button');
//       button.textContent = city;
//       button.classList.add('btn', 'btn-secondary', 'mb-2', 'd-block');
//       button.addEventListener('click', function() {
//         fetchForecast(city);
//       });

//       searchHistoryContainer.appendChild(button);
//     });
//   }

//   // Load and display the search history on page load
//   const initialSearchHistory = localStorage.getItem('searchHistory');
//   if (initialSearchHistory) {
//     const parsedSearchHistory = JSON.parse(initialSearchHistory);
//     displaySearchHistory(parsedSearchHistory);

//     // Fetch the weather forecast for the most recently searched city
//     const mostRecentCity = parsedSearchHistory[0];
//     fetchForecast(mostRecentCity);
//   }
// };