
import React, { useState } from 'react';
import axios from 'axios';
import './weather.css';

const WeatherApp = () => {
    const [location, setLocation] = useState('');
    const [currentWeather, setCurrentWeather]: any = useState(null);
    const [forecast, setForecast]: any = useState(null);
    const [error, setError] = useState('');

    const API_KEY = 'f56f24967aaf51182d1d4df628297c6d';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.get(API_URL, {
                params: {
                    q: location,
                    appid: API_KEY,
                    units: 'metric',
                },
            });

            setCurrentWeather(response.data);

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        q: location,
                        appid: API_KEY,
                        units: 'metric',
                    },
                }
            );

            setForecast(forecastResponse.data);
        } catch (error) {
            setError('Error fetching weather data. Please try again.');
            setCurrentWeather(null);
            setForecast(null)
            console.error(error);
        }
    };

    const groupForecastByDay = () => {
        if (!forecast) return [];

        const groupedForecast: any = {};

        forecast.list.forEach((forecastItem: any) => {
            const date = forecastItem.dt_txt.split(' ')[0];
            if (!groupedForecast[date]) {
                groupedForecast[date] = [forecastItem];
            } else {
                groupedForecast[date].push(forecastItem);
            }
        });

        return Object.values(groupedForecast);
    };
    return (
        <div>
            <div className="weather-app-container">
                <h1 className="weather-app-title">Weather App</h1>
                <form className="weather-app-form" onSubmit={handleSubmit}>
                    <input
                        className="weather-app-input"
                        type="text"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button className="weather-app-button" type="submit">
                        Get Weather
                    </button>
                </form>

                {error && <p className="weather-app-error">{error}</p>}

                {currentWeather && (
                    <div className="weather-app-current">
                        <h2 className="weather-app-heading">Current Weather</h2>
                        <p className="weather-app-info">
                            Temperature: {currentWeather.main.temp}°C
                        </p>
                        <p className="weather-app-info">
                            Description: {currentWeather.weather[0].description}
                        </p>
                        <p className="weather-app-info">
                            {`Long : ${currentWeather.coord.lon}   Lat: ${currentWeather.coord.lon}`}
                        </p>
                    </div>
                )}
            </div>

            <div className="forecast-app-container">
                {groupForecastByDay().map((forecastGroup: any) => (
                    <div className="forecast-app-card">
                        <img src={`http://openweathermap.org/img/w/${forecastGroup[1].weather[0].icon}.png`}
                            alt={forecastGroup[0].weather[0].description} className="forecast-card-image" />
                        <p className="forecast-card-name">{getDayOfWeek(forecastGroup[0].dt_txt.split(' ')[0])}</p>
                        <p className="forecast-card-name"> Temp : {forecastGroup[1].main.temp}°C </p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherApp;



function getDayOfWeek(dateString: Date) {
    const date = new Date(dateString);
    const options: any = { weekday: 'long' };
    const dayOfWeek = date.toLocaleDateString(undefined, options);
    return dayOfWeek;
}