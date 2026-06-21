import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        flexWrap: "wrap",
        background: darkMode ? "#13493f" : "#1f7e6b",
        color: "white",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)",
      }}
    >
      <h2 style={{ margin: 0, color: "white" }}>StaySense AI</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
        >
          Home
        </Link>

        <Link
          to="/about"
          style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
        >
          About
        </Link>

        <Link
          to="/dashboard"
          style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
        >
          Dashboard
        </Link>

        <Link
          to="/login"
          style={{ color: "white", textDecoration: "none", fontWeight: 600 }}
        >
          Login
        </Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "bold",
            background: "#f8d271",
            color: "#1f2937",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;