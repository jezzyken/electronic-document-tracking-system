const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Role = require("./Roles");

const StudentProfileSchema = new Schema(
  {
    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      surname: { type: String, required: true },
      firstName: { type: String, required: true },
      middleName: String,
      nameExtension: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    homeAddress: String,
    religion: String,
    dateOfBirth: Date,
    placeOfBirth: String,
    personalInfo: {
      gender: String,
      height: Number,
      weight: Number,
      citizenship: String,
      maritalStatus: String,
      bloodType: String,
    },
    familyInfo: {
      mothersName: String,
      fathersName: String,
    },
    contactInfo: {
      contactNumber: String,
      emailAddress: { type: String, lowercase: true },
    },
    pwd: {
      isPWD: { type: Boolean, default: false },
      disability: String,
    },
    emergencyContact: {
      contactPerson: String,
      contactNumber: String,
    },
    educationHistory: {
      elementary: {
        schoolName: String,
        schoolAddress: String,
        yearGraduated: Number,
      },
      juniorHigh: {
        schoolName: String,
        schoolAddress: String,
        yearGraduated: Number,
      },
      seniorHigh: {
        schoolName: String,
        schoolAddress: String,
        yearGraduated: Number,
      },
    },
    lastSchoolAttended: {
      academicLevel: String,
      schoolName: String,
      schoolAddress: String,
      yearGraduated: String,
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "graduated"],
      default: "active",
    },
    requirements: {
      form137: { type: Boolean, default: false },
      goodMoral: { type: Boolean, default: false },
      birthCertificate: { type: Boolean, default: false },
      pictures: { type: Boolean, default: false },
      transcriptOfRecords: { type: Boolean, default: false },
    },
    role: {
      type: String,
      default: "student",
      enum: ["student"],
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

async function generateStudentId() {
  const currentYear = new Date().getFullYear().toString().substr(-2);
  const sequence = (await StudentProfile.countDocuments()) + 1;
  return `${currentYear}-${sequence.toString().padStart(4, "0")}`;
}

StudentProfileSchema.pre("save", async function (next) {
  try {
    if (!this.studentId) {
      this.studentId = await generateStudentId();
      console.log(this.studentId);
    }

    if (this.isNew) {
      let studentRole = await Role.findOne({ name: "student" });
      if (!studentRole) {
        studentRole = await Role.create({
          name: "student",
          permissions: ["read"],
          description: "Regular student access",
        });
      }
      this.role = "student";
    }
  } catch (error) {
    return next(error);
  }
  next();
});

StudentProfileSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "student",
});

StudentProfileSchema.virtual("fullName").get(function () {
  const { firstName, middleName, surname, nameExtension } = this.name;
  const middle = middleName ? ` ${middleName} ` : " ";
  const extension = nameExtension ? ` ${nameExtension}` : "";
  return `${firstName}${middle}${surname}${extension}`;
});

StudentProfileSchema.set("toJSON", { virtuals: true });
StudentProfileSchema.set("toObject", { virtuals: true });

const StudentProfile = mongoose.model("StudentProfile", StudentProfileSchema);

module.exports = StudentProfile;
