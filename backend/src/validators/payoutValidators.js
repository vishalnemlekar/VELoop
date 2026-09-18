import { PAYOUT_METHODS } from "../constants/enums.js";
import { InvalidPayoutDetailsError } from "../errors/WithdrawalErrors.js";

const validateObject = (payoutDetails) => {
  if (
    !payoutDetails ||
    typeof payoutDetails !== "object" ||
    Array.isArray(payoutDetails)
  ) {
    throw new InvalidPayoutDetailsError();
  }
};

const validateUpiDetails = (payoutDetails) => {
  const { upiId } = payoutDetails;

  if (
    typeof upiId !== "string" ||
    upiId.trim().length < 3 ||
    upiId.trim().length > 100
  ) {
    throw new InvalidPayoutDetailsError();
  }
};

const validatePaypalDetails = (payoutDetails) => {
  const { email } = payoutDetails;

  if (
    typeof email !== "string" ||
    email.trim().length < 5 ||
    email.trim().length > 254 ||
    !email.includes("@")
  ) {
    throw new InvalidPayoutDetailsError();
  }
};

const validateGiftCardDetails = (payoutDetails) => {
  const { email } = payoutDetails;

  if (
    typeof email !== "string" ||
    email.trim().length < 5 ||
    email.trim().length > 254 ||
    !email.includes("@")
  ) {
    throw new InvalidPayoutDetailsError();
  }
};

export const validatePayoutDetails = (method, payoutDetails) => {
  if (!PAYOUT_METHODS.includes(method)) {
    throw new InvalidPayoutDetailsError();
  }

  validateObject(payoutDetails);

  switch (method) {
    case "UPI":
      validateUpiDetails(payoutDetails);
      break;

    case "PAYPAL":
      validatePaypalDetails(payoutDetails);
      break;

    case "AMAZON":
    case "GOOGLE_PLAY":
      validateGiftCardDetails(payoutDetails);
      break;

    default:
      throw new InvalidPayoutDetailsError();
  }

  return true;
};