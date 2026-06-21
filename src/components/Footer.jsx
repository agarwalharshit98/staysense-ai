function Footer({ darkMode }) {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "24px",
        background: darkMode ? "#0a3c33" : "#d9f7f0",
        color: darkMode ? "#d7fbe2" : "#0f172a",
        marginTop: "40px",
      }}
    >
      <p>© 2026 StaySense AI</p>
      <p>Built by Harshit Agarwal</p>
    </footer>
  );
}

export default Footer;