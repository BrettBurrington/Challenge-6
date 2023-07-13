$(document).ready(function() {
    // API key for OpenWeatherMap
    const apiKey = '4b28feb27b5f406b939352fc4f1f2c04';
  
    // Event listener for the search form submission
    $('#search-form').on('submit', function(event) {
      event.preventDefault();
      const city = $('#city-input').val().trim();
  
      // Clear the input field
      $('#city-input').val('');
  
      if (city !== '') {
        getCoordinates(city);
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
  
    function displayForecastData(data) {
      $('#forecast-container').empty();
  
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const forecastDate = moment(forecast.dt_txt).format('MMMM Do YYYY');
        const weatherIcon = `<img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">`;
        const temperature = convertKelvinToCelsius(forecast.main.temp);
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
  
    function convertKelvinToCelsius(temp) {
      return Math.round(temp - 273.15);
    }
  });
  