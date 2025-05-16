import mongoose from "mongoose";

const PaymentCouponSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  discountApplied: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const paymentCoupenConnection = mongoose.model(
  "Payment Coupen",
  paymentCoupenConnection
);

export default paymentCoupenConnection;
