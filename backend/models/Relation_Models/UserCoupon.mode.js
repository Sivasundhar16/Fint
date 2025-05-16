import mongoose from "mongoose";

const UserCouponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  claimedAt: { type: Date, default: Date.now },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const UserCoupenConnection = mongoose.model(
  "User Coupen",
  UserCoupenConnection
);

export default UserCoupenConnection;
