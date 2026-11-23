
function WeatherCard({ city, temperature, description, icon }) {
  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <div className="weather-icon">{icon}</div>
      <h1>{temperature}°C</h1>
      <p>{description}</p>
    </div>
  );
}

export default WeatherCard;
