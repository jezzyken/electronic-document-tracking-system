const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require("./Roles");

const ProfessorSchema = new Schema(
  {
    name: {
      surname: { type: String, required: true },
      firstName: { type: String, required: true },
      middleName: String,
      nameExtension: String,
    },
    role: {
      type: String,
      default: "faculty",
      enum: ["faculty"],
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    academicInfo: {
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
      position: String,
      employmentStatus: {
        type: String,
        enum: ["full-time", "part-time", "adjunct", "visiting"],
        required: true,
      },
      dateHired: {
        type: Date,
        required: true,
      },
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "on-leave", "terminated"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

ProfessorSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      let facultyRole = await Role.findOne({ name: "faculty" });
      if (!facultyRole) {
        facultyRole = await Role.create({
          name: "faculty",
          permissions: ["read", "write", "update"],
          description: "Faculty member access",
        });
      }
      this.role = "faculty";
    } catch (error) {
      return next(error);
    }
  }
  next();
});

ProfessorSchema.virtual("fullName").get(function () {
  return `${
    this.name.firstName
  } ${this.name.middleName ? this.name.middleName + " " : ""}${this.name.surname}${this.name.nameExtension ? " " + this.name.nameExtension : ""}`;
});

ProfessorSchema.index({ "name.surname": 1, "name.firstName": 1 });
ProfessorSchema.index({ "academicInfo.department": 1 });
ProfessorSchema.index({ employeeId: 1 }, { unique: true });

module.exports = mongoose.model("Professor", ProfessorSchema);
