import mongoose from "mongoose";
import dotenv from "dotenv";
import PayoutOption from "../models/PayoutOption.js";

dotenv.config();

const payoutOptions = [
  {
    optionId: "UPI_10",
    method: "UPI",
    name: "₹10 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 2400,
    payoutAmount: 10,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_25",
    method: "UPI",
    name: "₹25 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 5800,
    payoutAmount: 25,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_50",
    method: "UPI",
    name: "₹50 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 10000,
    payoutAmount: 50,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_100",
    method: "UPI",
    name: "₹100 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 19500,
    payoutAmount: 100,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_150",
    method: "UPI",
    name: "₹150 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 28500,
    payoutAmount: 150,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_300",
    method: "UPI",
    name: "₹300 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 52500,
    payoutAmount: 300,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_500",
    method: "UPI",
    name: "₹500 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 80500,
    payoutAmount: 500,
    payoutCurrency: "INR",
    active: true
  },
  {
    optionId: "UPI_1000",
    method: "UPI",
    name: "₹1000 UPI",
    type: "UPI",
    currency: "VE",
    requiredAmount: 150000,
    payoutAmount: 1000,
    payoutCurrency: "INR",
    active: true
  }
];

const seedPayoutOptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await PayoutOption.deleteMany({
      method: "UPI"
    });

    await PayoutOption.insertMany(payoutOptions);

    console.log("Payout options seeded successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Payout option seeding failed:", error.message);
    process.exit(1);
  }
};

seedPayoutOptions();