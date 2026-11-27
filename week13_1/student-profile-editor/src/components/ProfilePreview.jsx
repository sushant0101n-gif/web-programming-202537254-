
function ProfilePreview({ profile, skills, onEdit, onDelete }) {
  if (!profile) {
    return (
      <div className="empty-preview">
        <h2>Profile Preview</h2>
        <p>Your profile will appear here after submission.</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h2>Profile Preview</h2>

      <div className="profile-header">
        {profile.photo ? (
          <img
            className="profile-image"
            src={profile.photo}
            alt="Student profile"
          />
        ) : (
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3>{profile.name}</h3>
          <p>ID {profile.studentId} · Year {profile.year}</p>
          <h4>{profile.major}</h4>
        </div>
      </div>

      <div className="profile-bio">
        <h3>About Me</h3>
        <p>{profile.bio}</p>
      </div>

      <div className="profile-skills">
        <h3>Skills</h3>

        {skills.length > 0 ? (
          <div className="skill-tags">
            {skills.map((item, index) => (
              <span className="skill-tag" key={index}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p>No skills added yet.</p>
        )}
      </div>

      <div className="profile-actions">
        <button
          className="edit-button"
          onClick={onEdit}
        >
          Edit Profile
        </button>

        <button
          className="delete-button"
          onClick={onDelete}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePreview;
