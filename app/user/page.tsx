"use client";

import { useState } from "react";
import { Auth } from "aws-amplify";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogin() {
    try {
      const user = await Auth.signIn(username, password);

      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        setIsPasswordResetRequired(true);
      } else {
        setIsLoggedIn(true);
        console.log("User signed in successfully");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  }

  async function handlePasswordChange() {
    try {
      const user = await Auth.signIn(username, password);
      await Auth.completeNewPassword(user, newPassword);
      setIsPasswordResetRequired(false);
      setIsLoggedIn(true);
      console.log("Password changed successfully and user signed in");
    } catch (error) {
      console.error("Password change failed:", error);
      alert(`Password change failed: ${error.message}`);
    }
  }

  return (
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
              <button onClick={handlePasswordChange} className="button">
                Change Password
              </button>
            </>
          )}
          {!isPasswordResetRequired && (
            <button onClick={handleLogin} className="button">
              Login
            </button>
          )}
        </div>
      ) : (
        <div>
          <h1 className="title">Welcome, Admin</h1>
          <p>You are now logged in.</p>
        </div>
      )}
    </main>
  );
}