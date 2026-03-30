import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const result = await response.json();
      setTasks(result.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          status: "todo"
        })
      });

      setTitle("");
      await loadTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>SCM Ops Blueprint</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button type="submit">
          {loading ? "Guardando..." : "Crear"}
        </button>
      </form>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;