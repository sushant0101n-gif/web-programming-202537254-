
import { useState } from 'react';

function StudentForm({ onSubmit, initialData }) {
const [name, setName] = useState(initialData?.name || '');
const [studentId, setStudentId] = useState(initialData?.studentId || '');
const [major, setMajor] = useState(initialData?.major || '');
const [year, setYear] = useState(initialData?.year || '');
const [bio, setBio] = useState(initialData?.bio || '');
const [photo, setPhoto] = useState(initialData?.photo || '');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !studentId || !major || !year || !bio) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!/^\d{9}$/.test(studentId)) {
      alert('Student ID must be exactly 9 digits.');
      return;
    }

    onSubmit({
      name,
      studentId,
      major,
      year,
      bio,
      photo
    });
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>Student Information</h2>

      <div className="form-group">
        <label>Student Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          maxLength="9"
          required
        />
      </div>

      <div className="form-group">
        <label>Major</label>
        <select
          value={major}
          onChange={e => setMajor(e.target.value)}
          required
        >
          <option value="">Select Major</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Year</label>
        <div className="radio-group">
          {['1', '2', '3', '4'].map(item => (
            <label key={item}>
              <input
                type="radio"
                name="year"
                value={item}
                checked={year === item}
                onChange={e => setYear(e.target.value)}
              />
              Year {item}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength="199"
          required
        />
        <p className="bio-counter">
          {bio.length} / 199 characters
        </p>
      </div>

      <div className="form-group">
        <label>Profile Photo</label>
      
<input
  type="file"
  accept="image/*"
  onChange={e => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be smaller than 2MB.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setPhoto(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }}
/>

      </div>

      <button className="submit-button" type="submit">
        Create Profile
      </button>
    </form>
  );
}

export default StudentForm;
