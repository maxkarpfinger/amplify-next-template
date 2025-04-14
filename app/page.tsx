"use client";

import { useState, useEffect } from "react";
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


  function createUserSubmission() {
    const preferredDates = window.prompt("Preferred dates (comma separated)").split(",");
    client.models.User.create({
      name: name,
      preferredDates: preferredDates,
    });
  }

  return (
    <main>
      <h1>Kon lädt zu seinem 27. Burtseltag ein</h1>
      <div>
        <label htmlFor="name">Wer bist du: </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
        />
        <p>Servus, {name || "unbekannter"}!</p>
      </div>
      <button onClick={createUserSubmission}>+ new</button>
      <div>
        🥳 Bitte gebe dein(e) Wunschtermin(e) ein.
        <br />
      </div>
    </main>
  );
}
