
import { useState } from "react";
import RatingInput from "./RatingInput";
import TopicsCheckboxes from "./TopicsCheckboxes";

function FeedbackForm() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [rating, setRating] = useState("");
  const [topics, setTopics] = useState([]);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !/^\d{9}$/.test(studentId) || !rating) {
      alert("Please complete all required fields correctly.");
      return;
    }

    setSubmitted(true);
  }

  function handleReset() {
    setName("");
    setStudentId("");
    setRating("");
    setTopics([]);
    setComments("");
    setSubmitted(false);
  }

  return (
    <div className="feedback-container">
      <h1>Course Feedback Form</h1>
      <p>Please share your feedback about the course.</p>

      {submitted ? (
        <div className="thank-you">
          <h2>Thank You, {name}!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <button onClick={handleReset}>
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter 9-digit student ID"
              pattern="[0-9]{9}"
              title="Student ID must contain exactly 9 digits"
              required
            />
          </div>

          <RatingInput
            rating={rating}
            setRating={setRating}
          />

          <TopicsCheckboxes
            topics={topics}
            setTopics={setTopics}
          />

          <div className="form-group">
            <label>Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              maxLength="300"
              placeholder="Write your comments..."
            />
            <small>{comments.length}/300 characters</small>
          </div>

          <button
            type="submit"
            disabled={
              !name.trim() ||
              !/^\d{9}$/.test(studentId) ||
              !rating
            }
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
}

export default FeedbackForm;
