import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Low");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if (!taskName.trim()) return;

    if (editId !== null) {
      // Update existing task
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, text: taskName, deadline, priority } : t
        )
      );
      setEditId(null);
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        text: taskName,
        deadline,
        priority,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    setTaskName("");
    setDeadline("");
    setPriority("Low");
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const toggleComplete = (id) =>
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const editTask = (task) => {
    setTaskName(task.text);
    setDeadline(task.deadline);
    setPriority(task.priority);
    setEditId(task.id);
  };

  // Sort by priority: High → Medium → Low
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const sortedTasks = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="container">
      <h1>📝 To-do App</h1>

      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task"
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button onClick={handleSubmit}>
        {editId !== null ? "Update Task" : "Add Task"}
      </button>

      <ul>
        {sortedTasks.map((t) => (
          <li
            key={t.id}
            className={`task-item ${t.completed ? "completed" : ""}`}
          >
            <div
              onClick={() => toggleComplete(t.id)}
              style={{ cursor: "pointer", flex: 1 }}
            >
              {t.text} | {t.deadline || "No deadline"} |{" "}
              <span className={`priority-${t.priority.toLowerCase()}`}>
                {t.priority}
              </span>{" "}
              {t.completed ? "(Done)" : ""}
            </div>

            <div className="task-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // stop toggleComplete from firing
                  editTask(t);
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // stop toggleComplete from firing
                  deleteTask(t.id);
                }}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
