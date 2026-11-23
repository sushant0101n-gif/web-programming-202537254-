
function SavedCities({ cities, onRemove, onSelect }) {
  return (
    <div className="saved-cities">
      <h2>My Favorite Cities 📍</h2>

      {cities.length === 0 && (
        <p>No saved cities yet. Save your favorite weather locations!</p>
      )}

      {cities.map((city, index) => (
        <div className="saved-city" key={index}>
          <div>
            <h3>{city.name}</h3>
            <p>{city.temperature}°C</p>
          </div>

          <button onClick={() => onSelect(city.name)}>
            View
          </button>

          <button onClick={() => onRemove(city.name)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default SavedCities;
