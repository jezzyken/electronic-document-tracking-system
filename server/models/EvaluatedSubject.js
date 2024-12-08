const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EvaluatedSubjectSchema = new Schema(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    remarks: String,
    evaluatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EvaluatedSubject = mongoose.model(
  "EvaluatedSubject",
  EvaluatedSubjectSchema
);

module.exports = EvaluatedSubject;
