"use client";

import { useState } from "react";
import Head from "next/head";
import "./../../app/app.css";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import '@aws-amplify/ui-react/styles.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

Amplify.configure(outputs);

const client = generateClient<Schema>();

type DateKey = "2025-06-20" | "2025-06-21" | "2025-06-27" | "2025-06-28";

export default function AdminPage() {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<{ name: string; preferredDates: string, id: string }>>([]);

  // Calculate percentages for each date
  const totalUsers = users.length;
  const dateCounts: Record<DateKey, number> = {
    "2025-06-20": users.filter((user) => user.preferredDates.includes("2025-06-20")).length,
    "2025-06-21": users.filter((user) => user.preferredDates.includes("2025-06-21")).length,
    "2025-06-27": users.filter((user) => user.preferredDates.includes("2025-06-27")).length,
    "2025-06-28": users.filter((user) => user.preferredDates.includes("2025-06-28")).length,
  };

  const chartData = (date: DateKey) => ({
    labels: ["dabei", "fehlen"],
    datasets: [
      {
        data: [dateCounts[date], totalUsers - dateCounts[date]],
        backgroundColor: ["#007bff", "#e9ecef"],
        hoverBackgroundColor: ["#0056b3", "#d6d8db"],
      },
    ],
  });

  async function handleLogin() {
    //if (username === "test") {
      setIsLoggedIn(true);
      fetchUserData();
    //  return;
    //}
  }

  async function fetchUserData() {
    try {
      const response = await client.models.User.list();
      console.log("Fetched user data:", response);
      if (!response || !response.data) {
        console.error("No user data found.");
        return;
      }
      const userList = response.data.map((user: any) => ({
        name: user.name,
        preferredDates: user.preferredDates,
        id: user.id,
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function handleDeleteUser(index: number) {
    const userToDelete = users[index];
    try {
      await client.models.User.delete({ id: userToDelete.id });

      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
      alert(`User ${userToDelete.name} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
        <meta name="description" content="Admin login page to view user preferred dates." />
      </Head>
      <main className="container">
          <div>
            <h1 className="title">Die Wappler</h1>
            <button className="login-button" onClick={handleLogin}>Durchzählen</button>
            {users.length > 0 ? (
              <>
                <div className="charts-container">
                  <div className="chart">
                    <h3>20. Juni 2025</h3>
                    <Doughnut data={chartData("2025-06-20")} />
                  </div>
                  <div className="chart">
                    <h3>21. Juni 2025</h3>
                    <Doughnut data={chartData("2025-06-21")} />
                  </div>
                  <div className="chart">
                    <h3>27. Juni 2025</h3>
                    <Doughnut data={chartData("2025-06-27")} />
                  </div>
                  <div className="chart">
                    <h3>28. Juni 2025</h3>
                    <Doughnut data={chartData("2025-06-28")} />
                  </div>
                </div>
<table className="user-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>20. Juni</th>
      <th>21. Juni</th>
      <th>27. Juni</th>
      <th>28. Juni</th>
      <th>Aktionen</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user, index) => {
      const preferredDates = user.preferredDates.split(", ");
      return (
        <tr key={index}>
          <td>{user.name}</td>
          <td>{preferredDates.includes("2025-06-20") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-06-21") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-06-27") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-06-28") ? "✔️" : "❌"}</td>
          <td>
            <button
              className="delete-button"
              onClick={() => handleDeleteUser(index)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
              </>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
      </main>
    </>
  );
}