"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import Head from "next/head";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [name, setName] = useState<string>("");
  const [preferredDates, setPreferredDates] = useState<string[]>([]);

  const dates = [
    { value: "2025-07-18", label: "18. Juli" },
    { value: "2025-07-19", label: "19. Juli" },
    { value: "2025-08-01", label: "01. August" },
    { value: "2025-08-02", label: "02. August" },
  ];

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;
    setPreferredDates((prev) =>
      checked ? [...prev, value] : prev.filter((date) => date !== value)
    );
  }

  function createUserSubmission() {
    if (!name) {
      alert("Bitte Namen eingeben.");
      return;
    }
    
    client.models.User.create({
      name: name,
      preferredDates: preferredDates.join(","),
    });

    if (name.toLocaleLowerCase().includes("aaron")) {
      alert("Scheiß mal aufs Festival, Happiness kriegst du auch bei mir");
    } else if (name.toLocaleLowerCase().includes("bene")) { 
      alert("Ich misch dir auch nen Fernet Fanta");
    } else if (name.toLocaleLowerCase().includes("calvin")) {
      alert("Letzte Chance, diesmal muss es klappen");
    } else if (name.toLocaleLowerCase().includes("caro")) {
      alert("Nimm Trichter mit");
    } else if (name.toLocaleLowerCase().includes("chris")) {
      alert("Aber nicht wieder im Wohnzimmer einen anhauen");
    } else if (name.toLocaleLowerCase().includes("dani")) {
      alert("Wenn du nicht kommst gibt's keine Cookies dieses Jahr");
    } else if (name.toLocaleLowerCase().includes("eli")) {
      alert("Wenn du Bochum singst wirst von den Bayern-Fans verprügelt");
    } else if (name.toLocaleLowerCase().includes("fabi")) {
      alert("Drei Bier vor Vier");
    } else if (name.toLocaleLowerCase().includes("felix")) {
      alert("Mach mal nicht den Felix");
    } else if (name.toLocaleLowerCase().includes("gabriel")) {
      alert("Praktisch, kannst das Geschenk vom letztem Jahr nochmal verwenden");
    } else if (name.toLocaleLowerCase().includes("gerhard")) {
      alert("bist du bis dahin auch schon Professor?")
    } else if (name.toLocaleLowerCase().includes("henry")) {
      alert("Mach kein Auge");
    } else if (name.toLocaleLowerCase().includes("janina")) {
      alert("Diesmal musst du kommen, sonst kann ich deine ganzen Freunde (Flo) nicht so gut einladen");
    } else if (name.toLocaleLowerCase().includes("konstantin")) {
      alert("Da lohnt sich jeder Kilometer!");
    } else if (name.toLocaleLowerCase().includes("laura")) {
      alert("Lohnt sich auch zum Meilensammeln");
    } else if (name.toLocaleLowerCase().includes("madita")) {
      alert("Diesmal das Elotrans lieber vorher nehmen");
    } else if (name.toLocaleLowerCase().includes("maxl")) {
      alert("Ehrenmann");
    } else if (name.toLocaleLowerCase().includes("sascha")) {
      alert("Aber nicht wieder ins Eck kotzen");
    } else if (name.toLocaleLowerCase().includes("sophie")) {
      alert("Bring deinen Stecher mit");
    } else if (name.toLocaleLowerCase().includes("tassilo")) {
      alert("Ich misch dir auch nen Fernet Fanta");
    } else if (name.toLocaleLowerCase().includes("thimo")) {
      alert("Egal ob du kannst, aber bring ne Marlboro Gold mit");
    } else if (name.toLocaleLowerCase().includes("van")) {
      alert("Aber dann auch mindestens bis 6 wach bleiben");
    } else if (name.toLocaleLowerCase().includes("victor")) {
      alert("Warum nicht alle 8 Vornamen angegeben?")
    } else if (preferredDates.length === 0) {
      alert(`Sehr schade ${name}!`);
    } else {
      alert(`Danke ${name}, dass du mir deine Wunschtermine mitgeteilt hast!`);
    }
  }

  return (
    <>
    <Head>
        <title>Kon's 27th Birthday Invitation</title> {}
        <meta name="description" content="Kon lädt zu seinem 27. Geburtstag ein!" />
    </Head>
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
          Deine Wunschtermine: {preferredDates.join(",") || "Keine ausgewählt"}
        </p>
      </div>
      <button onClick={createUserSubmission} className="button">Und Los!</button> 
      <div className="footer">
        🥳 Ich freue mich auf dich!
      </div>
    </main>
    </>
  );
}
