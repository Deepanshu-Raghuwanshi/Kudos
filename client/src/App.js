import React from "react";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";
import LandingPage from "./pages/Landing/LandingPage";
import KudosPage from "./pages/kudos/KudosPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/kudos" element={<KudosPage />} />
    </Routes>
  );
};

export default App;
