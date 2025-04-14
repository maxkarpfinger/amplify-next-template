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
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [name, setName] = useState<string>("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function createUserSubmission() {
    const preferredDates = window.prompt("Preferred dates (comma separated)").split(",");
    client.models.User.create({
      name: name,
      preferredDates: preferredDates,
    });
  }

  return (
    <main>
      <h1>Kon lädt ein zu seinem 27. Burtseltag</h1>
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
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
      </div>
    </main>
  );
}
