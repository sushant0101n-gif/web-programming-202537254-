
function SkillsInput({ skills, setSkills }) {
  function addSkill(e) {
    e.preventDefault();

    const value = e.target.skill.value.trim();

    if (value === '' || skills.includes(value)) {
      return;
    }

    setSkills([...skills, value]);
    e.target.reset();
  }

  function removeSkill(index) {
    setSkills(skills.filter((item, i) => i !== index));
  }

  return (
    <div className="skills-section">
      <h3>My Skills</h3>

    <form className="skill-form" onSubmit={addSkill}>
  <input
    type="text"
    name="skill"
    placeholder="Enter one skill (e.g. React)"
  />

  <button type="submit">Add Skill</button>
</form>

<p className="skill-help">
  Press Enter or click Add Skill to add each skill.
</p>

      <div className="skill-list">
        {skills.map((item, index) => (
          <span className="skill-item" key={index}>
            {item}
            <button
              type="button"
              onClick={() => removeSkill(index)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsInput;
