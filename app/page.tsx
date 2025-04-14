"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [name, setName] = useState<string>("");
  const [preferredDates, setPreferredDates] = useState<string[]>([]);

  const dates = [
    { value: "2025-04-20", label: "20. April 2025" },
    { value: "2025-04-21", label: "21. April 2025" },
    { value: "2025-04-22", label: "22. April 2025" },
    { value: "2025-04-23", label: "23. April 2025" },
  ];

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;
    setPreferredDates((prev) =>
      checked ? [...prev, value] : prev.filter((date) => date !== value)
    );
  }

  function createUserSubmission() {
    if (!name || preferredDates.length === 0) {
      alert("Bitte Namen und Wunschtermine eingeben.");
      return;
    }
    client.models.User.create({
      name: name,
      preferredDates: preferredDates.join(","),
    });
  }

  return (
    <main className="container">
      <h1 className="title">Kon lädt zu seinem 27. Burtseltag ein</h1>
      <div className="form-group">
        <label htmlFor="name" className="label">Wer bist du:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="input"
        />
        <label className="label">Wann kannst du:</label>
        <div className="checkbox-group">
          {dates.map((date) => (
            <label
              key={date.value}
              className={`checkbox-label ${
                preferredDates.includes(date.value) ? "selected" : ""
              }`}
            >
              <input
                type="checkbox"
                value={date.value}
                checked={preferredDates.includes(date.value)}
                onChange={handleDateChange}
                className="checkbox-input"
              />
              {date.label}
            </label>
          ))}
        </div>  
        <p className="summary">
          Deine Wunschtermine: {preferredDates.join(", ") || "Keine ausgewählt"}
        </p>
      </div>
      <button onClick={createUserSubmission} className="button">+ new</button>
      <div className="footer">
        🥳 Ich freue mich auf dich!
      </div>
    </main>
  );
}
