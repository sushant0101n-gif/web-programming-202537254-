
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WeatherCard from './components/WeatherCard';
import StatCard from './components/StatCard';
import SearchBar from './components/SearchBar';
import SavedCities from './components/SavedCities';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Weather');
  const [darkMode, setDarkMode] = useState(false);
  const [city, setCity] = useState('Seoul');
  const [searchCity, setSearchCity] = useState('Seoul');
  const [weather, setWeather] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedCities, setSavedCities] = useState([]);

  const [searchLatitude, setSearchLatitude] = useState('');
  const [searchLongitude, setSearchLongitude] = useState('');

  useEffect(() => {
    async function getWeather() {
      setLoading(true);
      setError('');

      try {
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('City not found!');
        }

        const location = geoData.results[0];

        setLatitude(location.latitude);
        setLongitude(location.longitude);

        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`;

        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        setWeather(weatherData.current);
        setCity(location.name);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    getWeather();
  }, [searchCity]);

  function handleSearch(e) {
    e.preventDefault();

    if (city.trim()) {
      setSearchCity(city.trim());
      setActiveTab('Weather');
    }
  }

  async function handleCoordinateSearch(e) {
    e.preventDefault();

    const lat = Number(searchLatitude);
    const lon = Number(searchLongitude);

    if (
      searchLatitude.trim() === '' ||
      searchLongitude.trim() === '' ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      setError('Please enter valid latitude and longitude!');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    setActiveTab('Weather');

    try {
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`;

      const response = await fetch(weatherURL);
      const data = await response.json();

      if (!data.current) {
        throw new Error('Weather data not found!');
      }

      setWeather(data.current);
      setLatitude(lat);
      setLongitude(lon);
      setCity(`${lat}, ${lon}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

function getDescription(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code === 51) return 'Light Drizzle';
  if (code === 53) return 'Moderate Drizzle';
  if (code === 55) return 'Dense Drizzle';
  if (code === 56 || code === 57) return 'Freezing Drizzle';
  if (code === 61) return 'Slight Rain';
  if (code === 63) return 'Moderate Rain';
  if (code === 65) return 'Heavy Rain';
  if (code === 66 || code === 67) return 'Freezing Rain';
  if (code === 71) return 'Slight Snow';
  if (code === 73) return 'Moderate Snow';
  if (code === 75 || code === 77) return 'Heavy Snow';
  if (code === 80) return 'Slight Rain Showers';
  if (code === 81) return 'Moderate Rain Showers';
  if (code === 82) return 'Violent Rain Showers';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown Weather';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code === 85 || code === 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

  function saveCity() {
    if (!weather) return;

    const alreadySaved = savedCities.some(
      item => item.name === city
    );

    if (!alreadySaved) {
      setSavedCities([
        ...savedCities,
        {
          name: city,
          temperature: weather.temperature_2m
        }
      ]);
    }
  }

  function removeCity(name) {
    setSavedCities(
      savedCities.filter(item => item.name !== name)
    );
  }

  function selectCity(name) {
    setCity(name);
    setSearchCity(name);
    setActiveTab('Weather');
  }

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="main-content">
        <h1>{activeTab} Dashboard</h1>
        <p>Welcome to your Weather Dashboard!</p>

        {activeTab === 'Search' && (
          <SearchBar
            city={city}
            setCity={setCity}
            onSearch={handleSearch}
            loading={loading}
            latitude={searchLatitude}
            setLatitude={setSearchLatitude}
            longitude={searchLongitude}
            setLongitude={setSearchLongitude}
            onCoordinateSearch={handleCoordinateSearch}
          />
        )}

        {activeTab === 'Weather' && (
          <>
            <SearchBar
              city={city}
              setCity={setCity}
              onSearch={handleSearch}
              loading={loading}
              latitude={searchLatitude}
              setLatitude={setSearchLatitude}
              longitude={searchLongitude}
              setLongitude={setSearchLongitude}
              onCoordinateSearch={handleCoordinateSearch}
            />

            {loading && <p>Loading weather...</p>}
            {error && <p className="error">{error}</p>}

            {weather && !loading && (
              <>
                <WeatherCard
                  city={city}
                  temperature={weather.temperature_2m}
                  description={getDescription(weather.weather_code)}
                  icon={getWeatherIcon(weather.weather_code)}
                  latitude={latitude}
                  longitude={longitude}
                />

                <div className="stats">
                  <StatCard title="Wind Speed" value={`${weather.wind_speed_10m} km/h`} icon="💨" />
                  <StatCard title="Humidity" value={`${weather.relative_humidity_2m}%`} icon="💧" />
                  <StatCard title="Weather Code" value={weather.weather_code} icon={getWeatherIcon(weather.weather_code)} />
                </div>

                <button className="save-button" onClick={saveCity}>
                  ❤️ Save City
                </button>
              </>
            )}
          </>
        )}

        {activeTab === 'Saved' && (
          <SavedCities
            cities={savedCities}
            onRemove={removeCity}
            onSelect={selectCity}
          />
        )}
      </main>
    </div>
  );
}

export default App;
