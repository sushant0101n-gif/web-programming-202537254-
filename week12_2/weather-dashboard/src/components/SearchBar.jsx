
function SearchBar({ city, setCity, onSearch, loading, latitude, setLatitude, longitude, setLongitude, onCoordinateSearch }) {
  return (
    <div>
      <form className="search-bar" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search city... (Seoul, Tokyo, Kathmandu)"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
        Search Weather by Coordinates
      </h3>

      <form
        className="search-bar"
        onSubmit={onCoordinateSearch}
      >
        <input
          type="number"
          step="any"
          placeholder="Enter Latitude (e.g. 27.7172)"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
        />

        <input
          type="number"
          step="any"
          placeholder="Enter Longitude (e.g. 85.3240)"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          Search Coordinates
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
