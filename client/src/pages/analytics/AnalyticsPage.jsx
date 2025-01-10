import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./AnalyticsPage.module.css";
import axios from "axios";
import { formatBadge } from "../kudos/KudosList";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [mostLikedPost, setMostLikedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Kudos given",
      },
    },
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/kudo/analytics"
        ); // Replace with your backend API endpoint
        const data = response;

        const formattedChartData = {
          labels: data?.data?.data?.chartData?.map((item) =>
            formatBadge(item?.badge)
          ),
          datasets: [
            {
              label: "Kudos given",
              data: data.data?.data?.chartData?.map((item) => item?.count),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        setChartData(formattedChartData);
        setLeaderboardData(data?.data?.data?.leaderboardData);
        setMostLikedPost(data?.data?.data?.mostLikedPost);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.analytics_container}>
      <div className={styles.chart_section}>
        {chartData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>No chart data available</p>
        )}
      </div>

      <div className={styles.leaderboard_section}>
        <h2>Kudo Leaderboard</h2>
        {leaderboardData.length > 0 ? (
          <table className={styles.leaderboard_table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number of Kudos Received</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.kudosReceived}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaderboard data available</p>
        )}
      </div>

      <div className={styles.most_liked_section}>
        <h3>Most liked post:</h3>
        {mostLikedPost ? (
          <p>
            {mostLikedPost.givenBy} gave the{" "}
            <strong>{formatBadge(mostLikedPost?.badge)}</strong> badge to{" "}
            {mostLikedPost.givenTo} - "{mostLikedPost.message}"
          </p>
        ) : (
          <p>No liked post data available</p>
        )}
      </div>
      <div className={styles.back_button_section}>
        <button
          onClick={() => navigate("/")} // Redirect to Kudo page
          className={styles.back_button}
        >
          Go Back to Login Page
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
