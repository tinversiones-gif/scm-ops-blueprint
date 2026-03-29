const express = require("express");
const pool = require("../db/pool");
const env = require("../config/env");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      status: "ok",
      service: "api",
      env: env.NODE_ENV,
      version: env.APP_VERSION,
      db: "connected",
      dbTime: result.rows[0].now,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      service: "api",
      env: env.NODE_ENV,
      version: env.APP_VERSION,
      db: "disconnected",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;