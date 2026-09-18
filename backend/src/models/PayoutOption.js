import mongoose from "mongoose";
import {
  CURRENCIES,
  PAYOUT_METHODS,
  PAYOUT_TYPES
} from "../constants/enums.js";

const payoutOptionSchema = new mongoose.Schema(
  {
    optionId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
      trim: true
    },

    method: {
      type: String,
      enum: PAYOUT_METHODS,
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    type: {
      type: String,
      enum: PAYOUT_TYPES,
      required: true
    },

    currency: {
      type: String,
      enum: CURRENCIES,
      required: true
    },

    requiredAmount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Required amount must be an integer"
      }
    },

    payoutAmount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Payout amount must be an integer"
      }
    },

    payoutCurrency: {
      type: String,
      required: true,
      default: "INR",
      trim: true
    },

    active: {
      type: Boolean,
      required: true,
      default: true,
      index: true
    },

    eligibility: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

payoutOptionSchema.index({
  method: 1,
  active: 1
});

const PayoutOption = mongoose.model(
  "PayoutOption",
  payoutOptionSchema
);

export default PayoutOption;