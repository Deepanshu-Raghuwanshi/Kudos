import React, { useEffect, useState } from "react";
import style from "./LandingPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import KudosList from "../kudos/KudosList";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = location.state?.currentUser || null;
  const [kudos, setKudos] = useState([]);

  useEffect(() => {
    fetchKudos();
  }, [currentUser]);

  const fetchKudos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/kudos`);
      setKudos(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const HandleAnalyticNaviagte = () => {
    navigate("/kudos", { state: { currentUser: currentUser } });
  };

  const handleLike = async (id) => {
    try {
      console.log(id, "iiiiiiii");
      // Send a POST request to toggle the like status
      const response = await axios.patch(
        `http://localhost:3001/api/kudo/like`,
        {
          id,
        }
      );

      fetchKudos();
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };
  return (
    <div className={style.landing_container}>
      <header className={style.header_section}>
        <h1 className={style.welcome_message}>Welcome {currentUser}!</h1>
        <button
          onClick={HandleAnalyticNaviagte}
          className={style.give_kudo_button}
        >
          Give Kudo
        </button>
      </header>

      <main className={style.main_section}>
        <KudosList kudosData={kudos} handleLike={handleLike} />
      </main>

      <footer className={style.footer_section}>
        <button className={style.analytics_button}>Analytics</button>
      </footer>
    </div>
  );
};

export default LandingPage;
