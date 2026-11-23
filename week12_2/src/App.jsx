
import { useState, useEffect } from 'react';
import './App.css';

function SearchBar({ username, setUsername }) {
  return (
    <div className="search-box">
      <span>🔍</span>
      <input
        type="text"
        placeholder="Enter GitHub username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => setUsername('')}>Clear</button>
    </div>
  );
}

function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <img src={user.avatar_url} alt="GitHub avatar" />

      <div className="profile-details">
        <h2>{user.name || user.login}</h2>
        <p className="login">@{user.login}</p>
        <p>{user.bio || 'No bio available.'}</p>

        <div className="extra-info">
          {user.location && <span>📍 {user.location}</span>}
          {user.company && <span>🏢 {user.company}</span>}
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="github-link"
        >
          View GitHub Profile ↗
        </a>
      </div>
    </div>
  );
}
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchName = username.trim();

    if (!searchName) {
      setUser(null);
      setError('');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setUser(null);
    setError('');

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(searchName)}`,
          { signal: controller.signal }
        );

        if (response.status === 404) {
          throw new Error('GitHub user not found!');
        }

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }

        const data = await response.json();
        setUser(data);

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  return (
    <div className="app">
      <header>
        <h1>⚡ GitHub Explorer</h1>
        <p>Discover developers and explore their repositories.</p>
      </header>

      <SearchBar
        username={username}
        setUsername={setUsername}
      />

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching GitHub...</p>
        </div>
      )}

      {error && (
        <div className="error">
          ⚠️ {error}
        </div>
      )}

      {!username && (
        <div className="welcome">
          <h2>👨‍💻 Welcome to GitHub Explorer</h2>
          <p>Search for any GitHub developer to explore their profile.</p>
        </div>
      )}

    {user && !loading && (
  <>
    <ProfileCard user={user} />

    <div className="stats">
      <StatCard
        title="Repositories"
        value={user.public_repos}
        icon="📁"
      />

      <StatCard
        title="Followers"
        value={user.followers}
        icon="👥"
      />

      <StatCard
        title="Following"
        value={user.following}
        icon="🤝"
      />
    </div>
  </>
)}
    </div>
  );
}

export default App;
