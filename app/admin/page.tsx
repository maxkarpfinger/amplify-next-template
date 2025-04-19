"use client";

import { useState } from "react";
import Auth from "@aws-amplify/auth";
import Head from "next/head";
import "./../../app/app.css";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function AdminPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<{ name: string; preferredDates: string }>>([]);

  // Calculate percentages for each date
  const totalUsers = users.length;
  const dateCounts = {
    "2025-06-20": users.filter((user) => user.preferredDates.includes("2025-06-20")).length,
    "2025-06-21": users.filter((user) => user.preferredDates.includes("2025-06-21")).length,
    "2025-06-27": users.filter((user) => user.preferredDates.includes("2025-06-27")).length,
    "2025-06-28": users.filter((user) => user.preferredDates.includes("2025-06-28")).length,
  };

  const chartData = (date: string) => ({
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
    try {
      if (username === "test") {
        setIsLoggedIn(true);
        fetchUserData();
        return;
      }
      const user = await Auth.signIn({ username, password }) as any;
      if (user?.challengeName === "NEW_PASSWORD_REQUIRED") {
        alert("New password required. Please set a new password.");
        setIsPasswordResetRequired(true); // Prompt for new password
      } else {
      setIsLoggedIn(true);
      fetchUserData();
}
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        alert(`Login failed: ${error.message}`);
      } else {
        alert("Login failed: An unknown error occurred.");
      }
    }
  }

  async function handleNewPassword() {
    try {
      const user = await Auth.signIn({ username, password }) as any;
      await Auth.completeNewPassword(user, newPassword); // Complete the new password flow
      setPassword(""); // Clear the password field
      setNewPassword(""); // Clear the new password field
    } catch (error) {
      console.error("Password reset failed:", error);
if (error instanceof Error) {
      alert(`Password reset failed: ${error.message}`);
      } else {
        alert("Password reset failed: An unknown error occurred.");
      }
    }
  }

  async function fetchUserData() {
    try {
      client.models.User.list({}).then((response) => {
      const userList = response.data.map((user: any) => ({
        name: user.name,
        preferredDates: user.preferredDates.join(", "),
      }));
      setUsers(userList);
    })
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function handleDeleteUser(index: number) {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
        <meta name="description" content="Admin login page to view user preferred dates." />
      </Head>
      <main className="container">
        {!isLoggedIn ? (
          <div className="form-group">
            <h1 className="title">Admin Login</h1>
            <label htmlFor="username" className="label">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="input"
            />
            <label htmlFor="password" className="label">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="input"
            />
{isPasswordResetRequired && (
              <>
                <label htmlFor="newPassword" className="label">New Password:</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input"
                />
                <button onClick={handleNewPassword} className="button">Set New Password</button>
              </>
            )}
            {!isPasswordResetRequired && (
            <button onClick={handleLogin} className="button">Login</button>
)}
          </div>
        ) : (
          <div>
            <h1 className="title">Die Wappler</h1>
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
        )}
      </main>
    </>
  );
}