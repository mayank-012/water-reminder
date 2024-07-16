import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Weather.css"

const Weather = ({ setWeather }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const apiKey = '76518a5e5be90f3e7f46fb89c213da0f';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      axios.get(url)
        .then(response => {
          const { temp, humidity } = response.data.main;
          const city = response.data.name;
          setWeather({ temp, humidity });
          setWeatherData({ temp, humidity, city });
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    });
  }, [setWeather]);

  return (
    <div className='weather'>
      {weatherData ? (
        <div>
          <h2>Current Weather</h2>
          <p>City: {weatherData.city}</p>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
