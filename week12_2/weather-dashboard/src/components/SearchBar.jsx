
function SearchBar({ city, setCity, onSearch, loading, latitude, setLatitude, longitude, setLongitude, onCoordinateSearch }) {
  return (
    <>
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

      <form className="search-bar" onSubmit={onCoordinateSearch}>
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
        />

        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          Search Coordinates
        </button>
      </form>
    </>
  );
}

export default SearchBar;
