const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherLoadSchema = new Schema(
  {
    professor: {
      type: Schema.Types.ObjectId,
      ref: "Professor",
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
    subjects: [
      {
        subject: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        schedule: [
          {
            day: {
              type: String,
              enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              required: true,
            },
            timeStart: {
              type: String,
              required: true,
            },
            timeEnd: {
              type: String,
              required: true,
            },
            room: {
              type: String,
              required: true,
            },
          },
        ],
        section: {
          type: String,
          required: true,
        },
        students: [
          {
            student: {
              type: Schema.Types.ObjectId,
              ref: "StudentProfile",
            },
            grades: {
              final: {
                type: Number,
                min: 1,
                max: 5,
                default: null,
              },
              remarks: {
                type: String,
                enum: ["Passed", "Failed"],
                default: null,
              },
            },
          },
        ],
      },
    ],
    totalUnits: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

TeacherLoadSchema.pre("save", async function (next) {
  if (this.isModified("subjects")) {
    try {
      let total = 0;
      for (const subjectLoad of this.subjects) {
        const subject = await mongoose
          .model("Subject")
          .findById(subjectLoad.subject);
        if (subject) {
          total += subject.units;
        }
      }
      this.totalUnits = total;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

TeacherLoadSchema.methods.getCurrentEnrollment = function (subjectId) {
  const subject = this.subjects.find(
    (s) => s.subject.toString() === subjectId.toString()
  );
  return subject ? subject.students.length : 0;
};

TeacherLoadSchema.index({ professor: 1, academicYear: 1, semester: 1 });
TeacherLoadSchema.index({ "subjects.subject": 1 });
TeacherLoadSchema.index({ status: 1 });

const TeacherLoad = mongoose.model("TeacherLoad", TeacherLoadSchema);

module.exports = TeacherLoad;
