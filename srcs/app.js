function formatCityName(city) {
  city = city.trim();
  let formattedCityName = "";
  let cityArr = city.split(" ");
  for (let i = 0; i < cityArr.length; ++i) {
    if (cityArr[i].length !== 0) {
      cityString = cityArr[i];
      formattedCityName +=
        cityString[0].toUpperCase() + cityString.slice(1).toLowerCase();
      formattedCityName += " ";
    }
  }
  formattedCityName = formattedCityName.slice(0, -1);
  return formattedCityName;
}

function displayTimeDay(response) {
  let date = new Date(response.data.dt * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDay();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let dayElement = document.querySelector("#day");
  let hoursElement = document.querySelector("#hours");
  let minutesElement = document.querySelector("#minutes");

  if (hours < 10) {
    hoursElement.innerHTML = `0${hours}`;
  } else {
    hoursElement.innerHTML = `${hours}`;
  }
  if (minutes < 10) {
    minutesElement.innerHTML = `0${minutes}`;
  } else {
    minutesElement.innerHTML = `${minutes}`;
  }
  dayElement.innerHTML = `${weekDays[day]}`;
}

function displayWeatherForecast(response) {
  let weatherForecastElement = document.querySelector("#weather-forecast");
  let dailyForecast = response.data.daily;
  let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastHTML = "";

  weatherForecastCelciusMaxTemperature = [];
  weatherForecastCelciusMinTemperature = [];
  for (let day = 0; day < 6; ++day) {
    let date = new Date(dailyForecast[day].dt * 1000);

    weatherForecastCelciusMaxTemperature.push(dailyForecast[day].temp.max);
    weatherForecastCelciusMinTemperature.push(dailyForecast[day].temp.min);

    forecastHTML =
      forecastHTML +
      `
      <div class="col-2">
          <div class="day">${weekDay[date.getDay()]}</div>
            <img
              class="weather-forecast-image"
              src="http://openweathermap.org/img/wn/${
                dailyForecast[day].weather[0].icon
              }@2x.png"
              alt="day${day + 1} weather image"
               width="60"
            />
          <div class="weather-forecast-temperature">
              <span class="weather-forecast-temperature-max" id="day${
                day + 1
              }-max-temp">${Math.round(dailyForecast[day].temp.max)}°</span>
              <span class="weather-forecast-temperature-min" id="day${
                day + 1
              }-min-temp">${Math.round(dailyForecast[day].temp.min)}°</span>   
          </div>
      </div>`;
  }

  weatherForecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "ed55b36e362d8733f7d859247cedeaf2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherForecast);
}

function displayWeatherInformations(response) {
  displayTimeDay(response);
  let currentTemperatureElement = document.querySelector(
    "#current-temperature"
  );
  let realFeelElement = document.querySelector("#real-feel");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let pressureElement = document.querySelector("#pressure");
  let weatherConditionIcon = document.querySelector("#weather-icon");
  let weatherConditionElement = document.querySelector("#weather-condition");

  let currentTemperature = Math.round(response.data.main.temp);
  let realFeel = Math.round(response.data.main.feels_like);
  let humidity = Math.round(response.data.main.humidity);
  let pressure = Math.round(response.data.main.pressure);
  let weatherIcon = response.data.weather[0].icon;
  let weatherCondition = response.data.weather[0].description;
  windSpeed = response.data.wind.speed * 3.6;
  celciusTemperature = response.data.main.temp;
  realFeelCelciusTemperature = response.data.main.feels_like;

  weatherConditionIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  weatherConditionElement.innerHTML = weatherCondition;
  currentTemperatureElement.innerHTML = currentTemperature;
  realFeelElement.innerHTML = `${realFeel}°C`;
  humidityElement.innerHTML = humidity;
  windSpeedElement.innerHTML = `${Math.round(windSpeed)} kmph`;
  pressureElement.innerHTML = pressure;

  getForecast(response.data.coord);
}

function search(city) {
  let temperatureUnits = "metric";
  if (city) {
    let displayCityName = document.querySelector("#city-name");
    displayCityName.innerHTML = city;

    let apiKey = "b20ecfd3dab44a1228a1285e56521d52";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnits}`;
    axios.get(apiUrl).then(displayWeatherInformations);
  } else {
    alert("Please enter a city name");
  }
}

function handleSearchCitySubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city");
  city.value = formatCityName(city.value);
  search(city.value);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector(
    "#current-temperature"
  );
  let celciusElement = document.querySelector("#celcius");
  let fahrenheitElement = document.querySelector("#fahrenheit");
  let realFeelElement = document.querySelector("#real-feel");

  // Current Temperature in Celcius
  currentTemperatureElement.innerHTML = Math.round(celciusTemperature);
  // Real Feel Temeprature in Celcius
  realFeelElement.innerHTML = `${Math.round(realFeelCelciusTemperature)}°C`;

  // Weather Forecast Temeprature in Celcius
  for (let day = 0; day < 6; ++day) {
    maxTempElement = document.querySelector(`#day${day + 1}-max-temp`);
    minTempElement = document.querySelector(`#day${day + 1}-min-temp`);

    maxTempElement.innerHTML = `${Math.round(
      weatherForecastCelciusMaxTemperature[day]
    )}°`;
    minTempElement.innerHTML = `${Math.round(
      weatherForecastCelciusMinTemperature[day]
    )}°`;
  }

  // Wind Speed in km/h
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = `${Math.round(windSpeed)} kmph`;

  celciusElement.classList.add("active");
  celciusElement.classList.remove("inactive");
  fahrenheitElement.classList.add("inactive");
  fahrenheitElement.classList.remove("active");
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let currentTemperatureElement = document.querySelector(
    "#current-temperature"
  );
  let celciusElement = document.querySelector("#celcius");
  let fahrenheitElement = document.querySelector("#fahrenheit");
  let realFeelElement = document.querySelector("#real-feel");
  let realFeelFahrenheitTemperature = Math.round(
    (realFeelCelciusTemperature * 9) / 5 + 32
  );

  // Current Temperature in Fahrenheit
  currentTemperatureElement.innerHTML = Math.round(
    (celciusTemperature * 9) / 5 + 32
  );

  // Real Feel Temperature in Fahrenheit
  realFeelElement.innerHTML = `${realFeelFahrenheitTemperature}°F`;

  // Weather Forcast Temperature in Fahrenheit
  for (let day = 0; day < 6; ++day) {
    maxTempElement = document.querySelector(`#day${day + 1}-max-temp`);
    minTempElement = document.querySelector(`#day${day + 1}-min-temp`);

    maxTempElement.innerHTML = `${Math.round(
      (weatherForecastCelciusMaxTemperature[day] * 9) / 5 + 32
    )}°`;
    minTempElement.innerHTML = `${Math.round(
      (weatherForecastCelciusMinTemperature[day] * 9) / 5 + 32
    )}°`;
  }

  // Wind speed in mph
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = `${Math.round(windSpeed * 0.621371)} mph`;

  fahrenheitElement.classList.add("active");
  fahrenheitElement.classList.remove("inactive");
  celciusElement.classList.add("inactive");
  celciusElement.classList.remove("active");
}

let searchForm = document.querySelector(".search-bar");
searchForm.addEventListener("submit", handleSearchCitySubmit);

let celciusTemperature = null;
let celciusElement = document.querySelector("#celcius");
celciusElement.addEventListener("click", displayCelciusTemperature);

let realFeelCelciusTemperature = null;
let fahrenheitElement = document.querySelector("#fahrenheit");
fahrenheitElement.addEventListener("click", displayFahrenheitTemperature);

let weatherForecastCelciusMaxTemperature = null;
let weatherForecastCelciusMinTemperature = null;

let windSpeed = null;

search("New Delhi");
