
import { useState } from "react";
import "./SkillPicker.css";

const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Python"
];

function SkillPicker() {
  const [selected, setSelected] = useState([]);

  function toggle(skill, checked) {
    setSelected(prev =>
      checked
        ? [...prev, skill]
        : prev.filter(item => item !== skill)
    );
  }

  const isOverLimit = selected.length > 3;

  return (
    <div className="skill-container">
      <div className="skill-header">
        <h2>Programming Skills</h2>
        <p>Select the skills you have learned.</p>
      </div>

      <div className="skill-counter">
        <span>Selected Skills</span>
        <strong className={isOverLimit ? "over-limit" : ""}>
          {selected.length} / 3
        </strong>
      </div>

      {isOverLimit && (
        <p className="warning">
          Please select at most 3 skills.
        </p>
      )}

      <div className="skill-list">
        {SKILLS.map(skill => (
          <label className="skill-option" key={skill}>
            <input
              type="checkbox"
              checked={selected.includes(skill)}
              onChange={e => toggle(skill, e.target.checked)}
            />
            <span>{skill}</span>
          </label>
        ))}
      </div>

      <div className="selected-list">
        <h3>Your Selection</h3>
        <p>
          {selected.length > 0
            ? selected.join(", ")
            : "No skills selected yet."}
        </p>
      </div>
    </div>
  );
}

export default SkillPicker;
