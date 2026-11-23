
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;
