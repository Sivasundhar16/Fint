import mongoose from "mongoose";
const { Schema } = mongoose;

const CouponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, "Discount value cannot be negative"],
      validate: {
        validator: function (value) {
          if (this.discountType === "percentage") {
            return value <= 100;
          }
          return true;
        },
        message: "Percentage discount cannot exceed 100%",
      },
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.validFrom;
        },
        message: "Valid until date must be after valid from date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
      min: [1, "Usage limit must be at least 1"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, "Usage count cannot be negative"],
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Replaces manual createdAt/updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to check if coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.validUntil < new Date();
});

// Virtual property to check if coupon usage limit is reached
CouponSchema.virtual("isUsageLimitReached").get(function () {
  return this.usageCount >= this.usageLimit;
});

// Indexes for better query performance
CouponSchema.index({ couponCode: 1 });
CouponSchema.index({ merchantId: 1 });
CouponSchema.index({ validUntil: 1 });
CouponSchema.index({ isActive: 1 });

// Pre-save hook for additional validation
CouponSchema.pre("save", function (next) {
  if (this.isModified("usageCount") && this.usageCount > this.usageLimit) {
    throw new Error("Usage count cannot exceed usage limit");
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
