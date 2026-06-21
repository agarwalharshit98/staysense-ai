function Hero() {
  return (
    <section
      style={{
        padding: "60px 18px",
        textAlign: "center",
        background: "linear-gradient(180deg, rgba(5, 39, 35, 0.95), rgba(8, 44, 39, 0.95))",
        color: "white",
        minHeight: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: "0 0 20px", letterSpacing: "-1px" }}>
        StaySense AI
      </h1>

      <p style={{ maxWidth: "680px", margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.8, opacity: 0.92 }}>
        AI-powered guest review analysis for homestays and eco-tourism businesses.
      </p>

      <button
        style={{
          padding: "14px 28px",
          marginTop: "32px",
          borderRadius: "999px",
          background: "#fb923c",
          color: "white",
          border: "none",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 18px 40px rgba(251, 146, 60, 0.24)",
        }}
      >
        Get Started
      </button>
    </section>
  );
}

export default Hero;