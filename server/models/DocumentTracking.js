const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentTrackingSchema = new Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    fromDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    toDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    trackingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    documents: {
      attachments: [
        {
          title: String,
          fileUrl: String,
          fileType: String,
          fileSize: Number,
          uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          uploadedAt: Date,
        },
      ],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sentAt: Date,
    receivedAt: Date,
    status: {
      type: String,
      default: "Under Review",
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

documentTrackingSchema.index({ documentId: 1 });
documentTrackingSchema.index({ "fromDepartment.department": 1 });
documentTrackingSchema.index({ "toDepartment.department": 1 });
documentTrackingSchema.index({ "sentBy.user": 1 });
documentTrackingSchema.index({ "receivedBy.user": 1 });
documentTrackingSchema.index({ sentAt: 1 });
documentTrackingSchema.index({ status: 1 });

module.exports = mongoose.model("DocumentTracking", documentTrackingSchema);
