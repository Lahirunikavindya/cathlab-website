function SummaryCard({ label, value, danger = false }) {
  return (
    <article className={`summary-card ${danger ? "danger" : ""}`}>
      <p className="summary-label">{label}</p>
      <h3 className="summary-value">{value}</h3>
    </article>
  );
}

export default SummaryCard;
