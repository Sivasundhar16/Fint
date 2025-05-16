import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requestorName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    hospital: { type: String },
    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },
    status: {
      type: String,
      enum: ["active", "fulfilled", "expired"],
      default: "active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

export default BloodRequest;
