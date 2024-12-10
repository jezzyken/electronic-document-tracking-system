const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Department", departmentSchema);
