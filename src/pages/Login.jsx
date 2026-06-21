import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div style={{ padding: "40px" }}>
        <h1>Login</h1>

        <p>
          User authentication functionality will be added later.
        </p>
      </div>

      <Footer darkMode={darkMode} />
    </>
  );
}

export default Login;