const express = require("express");
const {
  register,
  login,
  verify_Email,
  get_me,
  logout,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.post("/login", login);
authRouter.get("/verify-email", verify_Email);
authRouter.get("/get-me", get_me);

module.exports = authRouter;
