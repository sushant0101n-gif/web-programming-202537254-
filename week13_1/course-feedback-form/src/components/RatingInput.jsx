
function RatingInput({ rating, setRating }) {
  return (
    <div className="form-group">
      <label>Rating *</label>

      <div className="rating-options">
        {[3, 4, 5].map((number) => (
          <label key={number}>
            <input
              type="radio"
              name="rating"
              value={number}
              checked={rating === number}
              onChange={() => setRating(number)}
            />
            {number} Stars
          </label>
        ))}
      </div>
    </div>
  );
}

export default RatingInput;
