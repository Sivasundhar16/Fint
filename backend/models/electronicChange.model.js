import mongoose from "mongoose";

const { Schema } = mongoose;

const ElectronicChangeSchema = new Schema(
  {
    changeId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["generated", "received", "expired"],
      default: "generated",
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.generatedAt;
        },
        message: "Expiry date must be after generation date",
      },
    },
  },
  { timestamps: true }
);

const ElectronicChange = mongoose.model(
  "ElectronicChange",
  ElectronicChangeSchema
);
export default ElectronicChange;
