
import { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import SkillsInput from './components/SkillsInput';
import ProfilePreview from './components/ProfilePreview';
import './App.css';

function App() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('studentProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('studentSkills');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('studentProfile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('studentProfile');
    }

    localStorage.setItem('studentSkills', JSON.stringify(skills));
  }, [profile, skills]);

  function handleProfileSubmit(data) {
    setProfile(data);
    setIsEditing(false);
  }

  function handleDelete() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this profile?'
    );

    if (confirmDelete) {
      setProfile(null);
      setSkills([]);
      setIsEditing(false);
    }
  }

  return (
    <div className="app-container">
      <header className="page-header">
        <h1>Student Profile Editor</h1>
        <p>Week 13_1 - Web Programming</p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <StudentForm
            key={isEditing ? 'editing' : 'new'}
            initialData={isEditing ? profile : null}
            onSubmit={handleProfileSubmit}
          />

          {isEditing && (
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel Editing
            </button>
          )}

          <SkillsInput
            skills={skills}
            setSkills={setSkills}
          />
        </section>

        <section className="preview-section">
          <ProfilePreview
            profile={profile}
            skills={skills}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
