const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      default: "grey",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Status", statusSchema);
