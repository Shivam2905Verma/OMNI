const mongoose = require("mongoose");

const pillarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pillar: { type: String, required: true },
    color: {
      type: [{ bg: String, icon: String }],
      default: [{ bg: "#fefced", icon: "#fbbf24" }],
    },
  },
  { timestamps: true },
);

const pillarModel = mongoose.model("pillar", pillarSchema);

module.exports = pillarModel;
