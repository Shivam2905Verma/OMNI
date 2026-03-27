const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
});

userSchema.methods.comparepassward = function (candidatePassward) {
  return bcrypt.compare(candidatePassward, this.password);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
