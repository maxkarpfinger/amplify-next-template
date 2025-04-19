"use client";

import { useState } from "react";
import Auth from "@aws-amplify/auth";
import Head from "next/head";
import "./../../app/app.css";

export default function AdminPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<{ name: string; preferredDates: string }>>([]);

  async function handleLogin() {
    try {
      await Auth.signIn({ username, password });
      setIsLoggedIn(true);
      fetchUserData();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    }
  }

  async function fetchUserData() {
    try {
      const userList = [
        { name: "User1", preferredDates: "2025-06-20, 2025-06-21" },
        { name: "User2", preferredDates: "2025-06-27" },
      ];
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
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
            <button onClick={handleLogin} className="button">Login</button>
          </div>
        ) : (
          <div>
            <h1 className="title">User Preferred Dates</h1>
            {users.length > 0 ? (
              <ul className="user-list">
                {users.map((user, index) => (
                  <li key={index} className="user-item">
                    <strong>{user.name}:</strong> {user.preferredDates || "No dates selected"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}