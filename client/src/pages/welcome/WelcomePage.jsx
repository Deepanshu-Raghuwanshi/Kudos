import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.css";

const WelcomePage = () => {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const handleLogin = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter a valid name");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users`, {
        name,
      });
      console.log(response.data.data.id, "response.data.data.id");
      if (response.data.exists) {
        navigate("/landing", {
          state: { currentUser: name, userId: response.data.data.id },
        });
      } else {
        navigate("/landing", {
          state: { currentUser: name, userId: response.data.data.id },
        });
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        setErrorMessage(
          "Server error: " + error.response.data.message || "Unknown error"
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        setErrorMessage("Network error. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className={styles.welcome_container}>
      <h1 className={styles.welcome_title}>WELCOME TO KUDOSPOT</h1>

      {errorMessage && (
        <div className={styles.error_message}>{errorMessage}</div>
      )}

      <form
        className={styles.login_form}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.login_input}
        />
        <button type="submit" className={styles.login_button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default WelcomePage;
