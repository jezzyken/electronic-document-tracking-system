const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const documentSchema = new Schema(
  {
    trackingNumber: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Under Review",
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'trackingNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    const year = new Date().getFullYear();
    this.trackingNumber = `DOC-${year}-${counter.seq.toString().padStart(4, '0')}`;
  }
  next();
});

documentSchema.index({ trackingNumber: 1 });
documentSchema.index({ title: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ priority: 1 });
documentSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Document", documentSchema);