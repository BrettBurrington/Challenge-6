$(document).ready(function() {

  const apiKey = '1c204e3aa689d1ef5eda0fddc9ccbce1';
 displaySearchHistory();


  // Event listener for the search form submission
  $('#search-form').on('submit', function(event) {
    event.preventDefault();
    const city = $('#city-input').val().trim();

   
    $('#city-input').val('');

    if (city !== '') {
      getCoordinates(city);
      getWeatherData(city)

    }
    
  });

  function getCoordinates(city) {
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    $.ajax({
      url: geoApiUrl,
      method: 'GET'
    }).then(function(response) {
      if (response.length > 0) {
        const { lat, lon } = response[0];
        getForecastData(lat, lon);
        saveSearchToLocalStorage(city); // Save the search history to local storage
      } else {
        console.log('Unable to find coordinates for the city.');
      }
    }).catch(function(error) {
      console.log('Error:', error.responseJSON.message);
    });
  }

  function getForecastData(lat, lon) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
      url: forecastApiUrl,
      method: 'GET'
    }).then(function(response) {
      displayForecastData(response);
    }).catch(function(error) {
      console.log('Error:', error.responseJSON.message);
    });
  }
  function displayCurrentWeather(data) {
    $('#current-city').text(data.name);
    $('#current-date').text(moment().format('MMMM Do YYYY'));
    $('#current-icon').html(`<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">`);
    $('#current-temp').text(`Temperature: ${convertKelvinToFahrenheit(data.main.temp)}°F`);
    $('#current-humidity').text(`Humidity: ${data.main.humidity}%`);
    $('#current-wind-speed').text(`Wind Speed: ${data.wind.speed} m/s`);
  }
  function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    $.ajax({
      url: apiUrl,
      method: 'GET'
    }).then(function(response) {
      displayCurrentWeather(response);

      const cityId = response.id;
      getForecastData(cityId);

    
    }).catch(function(error) {
      console.log('Error:', error.responseJSON.message);
    });
  }

  function displayForecastData(data) {
    $('#forecast-container').empty();

    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const forecastDate = moment(forecast.dt_txt).format('MMMM Do YYYY');
      const weatherIcon = `<img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">`;
      const temperature = convertKelvinToFahrenheit(forecast.main.temp);
      const humidity = forecast.main.humidity;

      const forecastCard = `
        <div class="forecast-card">
          <div class="forecast-date">${forecastDate}</div>
          <div class="forecast-icon">${weatherIcon}</div>
          <div class="forecast-temp">Temperature: ${temperature}°C</div>
          <div class="forecast-humidity">Humidity: ${humidity}%</div>
        </div>
      `;

      $('#forecast-container').append(forecastCard);
    }
  }

  function convertKelvinToFahrenheit(temp) {
    return Math.round((temp - 273.15) * 1.8 + 32);
  }

  function saveSearchToLocalStorage(city) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
    } else {
      searchHistory = [];
    }
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory(); // Update the displayed search history
  }

  function displaySearchHistory() {
    $('#history-list').empty();
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (searchHistory) {
      searchHistory.forEach(function(city) {
        //const historyItem = `<button>${city}</button>`;
        const historyItem = $( `<button>${city}</button>`)
        historyItem.on("click",function(){
          getCoordinates(city);
          getWeatherData(city)
    
        })
        $('#history-list').append(historyItem);
      });
    }
  }

  
})

