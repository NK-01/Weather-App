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
  console.log(response.data.daily);
  let weatherForecastElement = document.querySelector("#weather-forecast");
  let dailyForecast = response.data.daily;
  let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastHTML = "";

  weatherForecastCelciusMaxTemperature = [];
  weatherForecastCelciusMinTemperature = [];
  for (let day = 0; day < 6; ++day) {
    let date = new Date(dailyForecast[day].dt * 1000);

    weatherForecastCelciusMaxTemperature = Math.round(
      dailyForecast[day].temp.max
    );
    weatherForecastCelciusMinTemperature = Math.round(
      dailyForecast[day].temp.min
    );

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
              <span class="weather-forecast-temperature-max">${Math.round(
                dailyForecast[day].temp.max
              )}°</span>
              <span class="weather-forecast-temperature-min">${Math.round(
                dailyForecast[day].temp.min
              )}°</span>   
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
  let windSpeed = Math.round(response.data.wind.speed * 3.6);
  let weatherIcon = response.data.weather[0].icon;
  let weatherCondition = response.data.weather[0].description;
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
  windSpeedElement.innerHTML = windSpeed;
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

  currentTemperatureElement.innerHTML = Math.round(celciusTemperature);
  realFeelElement.innerHTML = `${Math.round(realFeelCelciusTemperature)}°C`;

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

  currentTemperatureElement.innerHTML = Math.round(
    (celciusTemperature * 9) / 5 + 32
  );
  realFeelElement.innerHTML = `${realFeelFahrenheitTemperature}°F`;

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

search("New Delhi");
