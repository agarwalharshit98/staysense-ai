import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar
  darkMode={darkMode}
  setDarkMode={setDarkMode}
/>

      <Hero />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "16px",
        padding: "16px 16px 8px"
      }}>
        <Card
          title="Sentiment Analysis"
          description="Classify reviews as Positive, Neutral, or Negative."
        />

        <Card
          title="Theme Detection"
          description="Detect food, host, cleanliness, location and value."
        />

        <Card
          title="AI Responses"
          description="Generate professional response suggestions."
        />
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default Home;