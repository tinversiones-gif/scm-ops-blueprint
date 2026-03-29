const pool = require("../db/pool");

async function getTasks(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, title, status, created_at FROM tasks ORDER BY id DESC"
    );

    res.json({
      status: "ok",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function createTask(req, res) {
  try {
    const { title, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "title is required",
      });
    }

    const result = await pool.query(
      "INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING id, title, status, created_at",
      [title, status || "todo"]
    );

    res.status(201).json({
      status: "ok",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  getTasks,
  createTask,
};