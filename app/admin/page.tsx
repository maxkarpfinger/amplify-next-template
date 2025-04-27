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
import { Authenticator } from '@aws-amplify/ui-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

Amplify.configure(outputs);

const client = generateClient<Schema>();

type DateKey = "2025-07-11" | "2025-07-12" | "2025-08-01" | "2025-08-02";

export default function AdminPage() {
  const [users, setUsers] = useState<Array<{ name: string; preferredDates: string, id: string }>>([]);

  // Calculate percentages for each date
  const totalUsers = users.length;
  const dateCounts: Record<DateKey, number> = {
    "2025-07-11": users.filter((user) => user.preferredDates.includes("2025-07-11")).length,
    "2025-07-12": users.filter((user) => user.preferredDates.includes("2025-07-12")).length,
    "2025-08-01": users.filter((user) => user.preferredDates.includes("2025-08-01")).length,
    "2025-08-02": users.filter((user) => user.preferredDates.includes("2025-08-02")).length,
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
      fetchUserData();
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
      <main className="container">
      <Authenticator loginMechanisms={['username']} signUpAttributes={['email']} hideSignUp={true}>
          <div>
            <h1 className="title">Die Wappler</h1>
            <button className="login-button" onClick={handleLogin}>Durchzählen</button>
            {users.length > 0 ? (
              <>
                <div className="charts-container">
                  <div className="chart">
                    <h3>11. Juli 2025</h3>
                    <Doughnut data={chartData("2025-07-11")} />
                  </div>
                  <div className="chart">
                    <h3>12. Juli 2025</h3>
                    <Doughnut data={chartData("2025-07-12")} />
                  </div>
                  <div className="chart">
                    <h3>01. August 2025</h3>
                    <Doughnut data={chartData("2025-08-01")} />
                  </div>
                  <div className="chart">
                    <h3>02. August 2025</h3>
                    <Doughnut data={chartData("2025-08-02")} />
                  </div>
                </div>
<table className="user-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>11. Juli</th>
      <th>12. Juli</th>
      <th>01. August</th>
      <th>02. August</th>
      <th>Aktionen</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user, index) => {
      const preferredDates = user.preferredDates.split(",");
      return (
        <tr key={index}>
          <td>{user.name}</td>
          <td>{preferredDates.includes("2025-07-11") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-07-12") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-08-01") ? "✔️" : "❌"}</td>
          <td>{preferredDates.includes("2025-08-02") ? "✔️" : "❌"}</td>
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
          </Authenticator>
      </main>
    </>
  );
}