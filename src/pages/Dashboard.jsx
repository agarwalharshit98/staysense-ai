import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div
        style={{
          padding: "40px",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
  style={{
    color: darkMode ? "white" : "black",
  }}
>
  Dashboard
</h1>

<p
  style={{
    color: darkMode ? "#d1d5db" : "#374151",
    fontSize: "22px",
fontWeight: "500",
  }}
>
  Review analytics and insights will be displayed here.
</p>
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default Dashboard;