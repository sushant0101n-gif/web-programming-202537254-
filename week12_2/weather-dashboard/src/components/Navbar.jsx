
function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  const tabs = ['Weather', 'Search', 'Saved'];

  return (
    <nav className="navbar">
      <h2>☀️ WeatherApp</h2>

      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  );
}

export default Navbar;
