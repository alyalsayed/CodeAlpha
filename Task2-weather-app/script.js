//Selecting elements
const timeEl = document.querySelector("#time");
const dateEl = document.querySelector("#date");
const currentWeatherItemsEl = document.querySelector("#weather-items");
const timezoneEl = document.querySelector("#time-zone");
const countryEl = document.querySelector("#country");
const weatherForecastEl = document.querySelector("#weather-forecast");
const currentTempEl = document.querySelector("#current-temp");
const searchInput = document.querySelector(".search__input");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

function padZero(value) {
  return value < 10 ? "0" + value : value;
}

function formatTime(hour, minute) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  return `${padZero(hoursIn12HrFormat)}:${padZero(minute)} ${ampm}`;
}

function formatDate(day, date, month) {
  return `${days[day]}, ${date} ${months[month]}`;
}
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minute = time.getMinutes();

  const formattedTime = formatTime(hour, minute);
  const formattedDate = formatDate(day, date, month);

  timeEl.innerHTML = formattedTime;
  dateEl.innerHTML = formattedDate;
}, 1000);

function getWeatherData(latitude, longitude) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      showWeatherData(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function showWeatherData(data) {
  const { timezone, lat, lon, current, daily } = data;
  const { humidity, pressure, sunrise, sunset, wind_speed } = current;

  timezoneEl.textContent = timezone;
  countryEl.textContent = `${lat}N ${lon}E`;

  currentWeatherItemsEl.innerHTML = `
      <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
      </div>
      <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
      </div>
      <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
      </div>
      <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
      </div>
      <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
      </div>
    `;

  let otherDayForecastHTML = "";
  daily.forEach((day, idx) => {
    const { dt, temp, weather } = day;
    const isToday = idx === 0;

    if (isToday) {
      currentTempEl.innerHTML = `
          <img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png"
            alt="weather icon" class="w-icon">
          <div class="other">
            <div class="day">${window.moment(dt * 1000).format("dddd")}</div>
            <div class="temp">Night - ${temp.night}&#176;C</div>
            <div class="temp">Day - ${temp.day}&#176;C</div>
          </div>
        `;
    } else {
      otherDayForecastHTML += `
          <div class="weather-forecast-item">
            <div class="day">${window.moment(dt * 1000).format("ddd")}</div>
            <img src="http://openweathermap.org/img/wn/${
              weather[0].icon
            }@2x.png"
              alt="weather icon" class="w-icon">
            <div class="temp">Night - ${temp.night}&#176;C</div>
            <div class="temp">Day - ${temp.day}&#176;C</div>
          </div>
        `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecastHTML;
}

function searchLocation(location) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      const { coord } = data;
      getWeatherData(coord.lat, coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching location data:", error);
    });
}

// Get weather data based on user's current location
function getWeatherByCurrentLocation() {
  navigator.geolocation.getCurrentPosition((success) => {
    const { latitude, longitude } = success.coords;
    getWeatherData(latitude, longitude);
  });
}

// Get weather data by default (based on current location)
getWeatherByCurrentLocation();

// Event listener for search input
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const location = e.target.value;
    searchLocation(location);
  }
});
