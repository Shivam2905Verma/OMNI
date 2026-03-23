require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const dataRouter = require("./routes/data.route");
const authRouter = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const handlleError = require("./middleware/error.middleware");

app.use(
  cors({
    origin: ["http://localhost:5173" , "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/omni", dataRouter);

app.use(handlleError);

module.exports = app;
