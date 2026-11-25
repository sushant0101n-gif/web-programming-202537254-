
function WeatherCard({ city, temperature, description, icon, latitude, longitude }) {
  return (
    <div className="weather-card">
      <h2>{city}</h2>

      <div className="weather-icon">{icon}</div>

      <h1>{temperature}°C</h1>

      <p>{description}</p>

      <div className="location-coordinates">
        <p>🌍 Latitude: {latitude}</p>
        <p>📍 Longitude: {longitude}</p>
      </div>
    </div>
  );
}

export default WeatherCard;
