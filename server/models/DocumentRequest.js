

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentRequestSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    trackingNumber: {
      type: String,
      unique: true,
    },
    requestedDocuments: [
      {
        type: String,
        required: true,
      },
    ],
    purpose: {
      type: String,
      required: true,
    },
    notes: String,
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "ready",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        notes: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

DocumentRequestSchema.pre("save", async function (next) {
  if (!this.trackingNumber) {
    const generateAlphanumeric = (length) => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const year = new Date().getFullYear();
    const alphanumeric = generateAlphanumeric(8);
    this.trackingNumber = `REQ-${year}-${alphanumeric}`;

    if (this.isNew) {
      this.statusHistory = [
        {
          status: this.status || "pending",
          notes: "Initial request submitted",
          timestamp: new Date(),
        },
      ];
    }
  }
  next();
});

DocumentRequestSchema.index({ trackingNumber: 1 });
DocumentRequestSchema.index({ email: 1 });
DocumentRequestSchema.index({ studentId: 1 });
DocumentRequestSchema.index({ status: 1 });
DocumentRequestSchema.index({ createdAt: 1 });

const DocumentRequest = mongoose.model(
  "DocumentRequest",
  DocumentRequestSchema
);

module.exports = DocumentRequest;
