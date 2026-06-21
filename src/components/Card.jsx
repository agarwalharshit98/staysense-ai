function Card({ title, description }) {
  const toneColor =
    title === "Sentiment Analysis"
      ? "#2dd4bf"
      : title === "Theme Detection"
      ? "#fb923c"
      : "#8b5cf6";

  return (
    <div
      style={{
        border: `2px solid ${toneColor}`,
        padding: "24px",
        borderRadius: "22px",
        background: "rgba(255, 255, 255, 0.04)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.18)",
        color: "white",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "12px" }}>{title}</h3>
      <p style={{ opacity: 0.85, lineHeight: 1.8 }}>{description}</p>
    </div>
  );
}

export default Card;