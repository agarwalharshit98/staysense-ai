import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ComponentsDemo from "./pages/ComponentsDemo";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/about"
            element={
              <About
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/login"
            element={
              <Login
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/components"
            element={
              <ComponentsDemo
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;