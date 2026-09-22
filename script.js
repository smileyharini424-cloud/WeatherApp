const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMessage = document.getElementById("errorMessage");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name!";
        return;
    }

    errorMessage.textContent = "";

    try {

        const geoResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json"
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorMessage.textContent = "City not found!";
            return;
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            location.latitude +
            "&longitude=" +
            location.longitude +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto"
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        cityName.textContent = location.name + ", " + location.country;

        temperature.textContent =
            current.temperature_2m + "°C";

        humidity.textContent =
            "Humidity: " + current.relative_humidity_2m + "%";

        wind.textContent =
            "Wind Speed: " + current.wind_speed_10m + " km/h";

        condition.textContent =
            getWeatherCondition(current.weather_code);

        weatherIcon.textContent =
            getWeatherIcon(current.weather_code);

    } catch (error) {

        errorMessage.textContent =
            "Something went wrong. Please try again.";

        console.error(error);
    }
}

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}

function getWeatherIcon(code) {

    if (code === 0) {
        return "Sunny";
    }

    if (code >= 1 && code <= 3) {
        return "Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Weather";
}
