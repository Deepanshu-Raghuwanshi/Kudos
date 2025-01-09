import React, { useState, useEffect } from "react";
import styles from "./KudosPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const KudosPage = ({ adminName }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const currentUser = location.state?.currentUser || null;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users?user=${currentUser}`
      );

      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedBadge || !reason) {
      alert("Please fill out all fields.");
      return;
    }

    const data = {
      toUser: selectedUser,
      badge: selectedBadge.toLowerCase().replace(/ /g, "_"),
      reason_for_kudos: reason,
      byUser: currentUser,
    };

    console.log(data, "pppp");

    try {
      const response = await axios.post("http://localhost:3001/api/kudos", {
        data,
      });

      if (response.ok) {
        alert("Kudo sent successfully!");
        setSelectedUser("");
        setSelectedBadge("");
        setReason("");
      } else {
        alert("Failed to send kudo.");
      }
    } catch (error) {
      console.error("Error sending kudo:", error);
    }
  };

  return (
    <div className={styles.kudos_page_container}>
      <form className={styles.kudos_form} onSubmit={handleSubmit}>
        <h2 className={styles.kudos_title}>Give Kudos</h2>

        <select
          className={styles.dropdown}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select the user you want to give kudos to</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
        >
          <option value="">Select the badge you want to give</option>
          <option value="helping_hand">HELPING HAND</option>
          <option value="excellence">EXCELLENCE</option>
          <option value="above_and_beyond">ABOVE AND BEYOND</option>
          <option value="client_focus">CLIENT FOCUS</option>
        </select>

        <textarea
          className={styles.text_area}
          placeholder="Reason for Kudos"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button type="submit" className={styles.submit_button}>
          Give Kudos
        </button>
      </form>
    </div>
  );
};

export default KudosPage;
