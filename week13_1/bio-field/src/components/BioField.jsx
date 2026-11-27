
import { useState } from "react";
import "./BioField.css";

function BioField() {
  const [bio, setBio] = useState("");

  const MAX = 200;
  const remaining = MAX - bio.length;
  const limitReached = remaining === 0;

  function handleChange(e) {
    const newBio = e.target.value;

    if (newBio.length <= MAX) {
      setBio(newBio);
    }
  }

  function handleClear() {
    setBio("");
  }

  return (
    <div className="bio-container">
      <div className="bio-header">
        <h2>About Me</h2>
        <p>Write a short introduction about yourself.</p>
      </div>

      <div className="bio-field">
        <label htmlFor="bio">Your Bio</label>

        <textarea
          id="bio"
          value={bio}
          onChange={handleChange}
          rows={5}
          maxLength={MAX}
          placeholder="Tell us something about yourself..."
          disabled={limitReached}
        />

        <div className="bio-footer">
          <p className={remaining < 20 ? "warning" : "normal"}>
            {bio.length} / {MAX} characters
          </p>

          <span>
            {limitReached
              ? "Character limit reached"
              : `${remaining} characters remaining`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={bio.length === 0}
        >
          Clear Bio
        </button>
      </div>
    </div>
  );
}

export default BioField;
