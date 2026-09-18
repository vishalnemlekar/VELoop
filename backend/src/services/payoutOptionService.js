import PayoutOption from "../models/PayoutOption.js";
import AppError from "../errors/AppError.js";

export const getActivePayoutOptions = async () => {
  const options = await PayoutOption.find({
    active: true
  })
    .sort({ method: 1, requiredAmount: 1 })
    .lean();

  return options;
};

export const getPayoutOption = async (optionId) => {
  if (typeof optionId !== "string" || optionId.trim().length === 0) {
    throw new AppError(
      "Payout option ID is required",
      "INVALID_OPTION_ID",
      400
    );
  }

  const option = await PayoutOption.findOne({
    optionId,
    active: true
  }).lean();

  if (!option) {
    throw new AppError(
      "Payout option not found or inactive",
      "PAYOUT_OPTION_NOT_FOUND",
      404
    );
  }

  return option;
};

export const validatePayoutOption = async (optionId) => {
  const option = await getPayoutOption(optionId);

  return {
    valid: true,
    option
  };
};