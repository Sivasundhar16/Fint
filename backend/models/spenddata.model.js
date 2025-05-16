import mongoose from "mongoose";

const SpendDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["user", "merchant"], required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  spendDate: { type: Date, default: Date.now },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  createdAt: { type: Date, default: Date.now },
});

const SpendData = mongoose.model("Spend Data", SpendDataSchema);

export default SpendData;
