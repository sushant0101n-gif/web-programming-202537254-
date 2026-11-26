
import { useState } from 'react';

function SearchBar({
  city,
  setCity,
  onSearch,
  loading,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  onCoordinateSearch
}) {
  const [searchMode, setSearchMode] = useState('city');

  return (
    <div className="search-container">
      <h2>Find a Place</h2>

      <div className="search-tabs">
        <button
          type="button"
          className={searchMode === 'city' ? 'active' : ''}
          onClick={() => setSearchMode('city')}
        >
          City Search
        </button>

        <button
          type="button"
          className={searchMode === 'coordinates' ? 'active' : ''}
          onClick={() => setSearchMode('coordinates')}
        >
          Coordinates
        </button>
      </div>

      {searchMode === 'city' && (
        <form className="search-form" onSubmit={onSearch}>
          <label>City or Country</label>

          <div className="search-input-group">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={e => setCity(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search Weather'}
            </button>
          </div>
        </form>
      )}

      {searchMode === 'coordinates' && (
        <form className="coordinate-form" onSubmit={onCoordinateSearch}>
          <div className="coordinate-inputs">
            <div>
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 27.7172"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>

            <div>
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 85.3240"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Coordinates'}
          </button>
        </form>
      )}
    </div>
  );
}

export default SearchBar;
