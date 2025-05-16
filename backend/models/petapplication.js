import mongoose from "mongoose";

const PetApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  petType: { type: String, required: true },
  petName: { type: String, required: true },
  petBreed: { type: String },
  petAge: { type: Number },
  applicationStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  applicationDate: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  reviewedAt: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const PetApplication = mongoose.model("Pet Application", PetApplicationSchema);

export default PetApplication;
