
function SearchBar({ city, setCity, onSearch, loading }) {
  return (
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
  );
}

export default SearchBar;
