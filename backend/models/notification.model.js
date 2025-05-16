// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
    },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
