import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div style={{ padding: "40px", color: darkMode ? "#e5e7eb" : "#111827" }}>
        <h1>About StaySense AI</h1>

        <p style={{ maxWidth: "720px", lineHeight: 1.8, opacity: 0.88 }}>
          StaySense AI helps homestay owners understand guest feedback using AI.
          It provides insights that help improve customer satisfaction and service quality.
        </p>
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default About;