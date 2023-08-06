const express = require("express");
const routeHandler = require("./routeHandler");

const app = express();
app.use(express.json());
app.use("/api/v1", routeHandler);

module.exports = app;
