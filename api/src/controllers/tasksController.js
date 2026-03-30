const pool = require("../db/pool");
const { createTaskSchema, updateTaskSchema } = require("../schemas/taskSchema");

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
    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { title, status } = parsed.data;

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

async function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        status: "error",
        message: "invalid task id",
      });
    }

    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "invalid request body",
        errors: parsed.error.flatten(),
      });
    }

    const { title, status } = parsed.data;

    if (title === undefined && status === undefined) {
      return res.status(400).json({
        status: "error",
        message: "at least one field is required",
      });
    }

    const currentTaskResult = await pool.query(
      "SELECT id, title, status, created_at FROM tasks WHERE id = $1",
      [taskId]
    );

    if (currentTaskResult.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "task not found",
      });
    }

    const currentTask = currentTaskResult.rows[0];

    const updatedTitle = title ?? currentTask.title;
    const updatedStatus = status ?? currentTask.status;

    const result = await pool.query(
      "UPDATE tasks SET title = $1, status = $2 WHERE id = $3 RETURNING id, title, status, created_at",
      [updatedTitle, updatedStatus, taskId]
    );

    res.json({
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

async function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        status: "error",
        message: "invalid task id",
      });
    }

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id, title, status, created_at",
      [taskId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "task not found",
      });
    }

    res.json({
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
  updateTask,
  deleteTask,
};