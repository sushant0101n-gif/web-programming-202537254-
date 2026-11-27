
function TopicsCheckboxes({ topics, setTopics }) {
  const availableTopics = ["HTML", "CSS", "JavaScript", "Git", "React"];

  function handleChange(topic) {
    if (topics.includes(topic)) {
      setTopics(topics.filter((item) => item !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  }

  return (
    <div className="form-group">
      <label>Topics Covered Well</label>

      <div className="topics-options">
        {availableTopics.map((topic) => (
          <label key={topic}>
            <input
              type="checkbox"
              checked={topics.includes(topic)}
              onChange={() => handleChange(topic)}
            />
            {topic}
          </label>
        ))}
      </div>
    </div>
  );
}

export default TopicsCheckboxes;
