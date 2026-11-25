
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

  function getDescription(code) {
    if (code === 0) return 'Clear Sky ☀️';
    if (code <= 3) return 'Cloudy ⛅';
    if (code <= 48) return 'Fog 🌫️';
    if (code <= 67) return 'Rain 🌧️';
    if (code <= 77) return 'Snow ❄️';
    if (code <= 82) return 'Rain Showers 🌦️';
    if (code >= 95) return 'Thunderstorm ⛈️';
    return 'Unknown Weather';
  }

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
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
          />
        )}

        {activeTab === 'Weather' && (
          <>
            <SearchBar
              city={city}
              setCity={setCity}
              onSearch={handleSearch}
              loading={loading}
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
                  <StatCard title="Weather Code" value={weather.weather_code} icon="🌤️" />
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
