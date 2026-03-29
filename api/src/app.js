const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const healthRouter = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.use("/health", healthRouter);

module.exports = app;