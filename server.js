require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// ✅ Create a new task
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;
  const sql = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
  pool.query(sql, [title, description, status || "pending"], (err, result) => {
    if (err) return res.status(500).json({ error: "Task creation failed" });
    res.status(201).json({ id: result.insertId, title, description, status });
  });
});

// ✅ Get all tasks
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch tasks" });
    res.json(results);
  });
});

// ✅ Get a single task by ID
app.get("/tasks/:id", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE id = ?";
  pool.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching task" });
    if (results.length === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json(results[0]);
  });
});

// ✅ Update a task by ID
app.put("/tasks/:id", (req, res) => {
  const { title, description, status } = req.body;
  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
  pool.query(
    sql,
    [title, description, status, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error updating task" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task updated successfully" });
    }
  );
});

// ✅ Delete a task by ID
app.delete("/tasks/:id", (req, res) => {
  const sql = "DELETE FROM tasks WHERE id = ?";
  pool.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error deleting task" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  });
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
