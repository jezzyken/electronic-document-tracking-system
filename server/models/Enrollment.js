const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ["First", "Second"],
      required: true,
    },
    yearLevel: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
    enrollmentType: {
      type: String,
      enum: ["new", "old"],
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],
    totalUnits: {
      type: Number,
      default: 0,
    },
    enrollmentStatus: {
      type: String,
      enum: ["pending", "evaluated", "enrolled"],
      default: "pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

EnrollmentSchema.pre("save", async function (next) {
  if (this.isModified("subjects")) {
    let total = 0;
    for (const subject of this.subjects) {
      const subjectDoc = await mongoose
        .model("Subject")
        .findById(subject.subject);
      if (subjectDoc) {
        total += subjectDoc.units;
      }
    }
    this.totalUnits = total;
  }
  next();
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;
