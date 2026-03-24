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
    origin: ["https://omni-five-topaz.vercel.app" , "http://localhost:5174" , "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
//* use api before any route !important
app.use("/api/auth", authRouter);
app.use("/api/omni", dataRouter);
app.get("/ping", (req, res) => res.send("pong"));
app.use(handlleError);

module.exports = app;
