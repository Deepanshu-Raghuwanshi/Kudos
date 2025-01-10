import React from "react";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/welcome/WelcomePage";
import LandingPage from "./pages/Landing/LandingPage";
import KudosPage from "./pages/kudos/KudosPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/kudos" element={<KudosPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
};

export default App;
