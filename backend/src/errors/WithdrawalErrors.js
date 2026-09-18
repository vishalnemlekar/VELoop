import AppError from "./AppError.js";

export class PayoutOptionNotFoundError extends AppError {
  constructor() {
    super(
      "Payout option not found or inactive",
      "PAYOUT_OPTION_NOT_FOUND",
      404
    );
  }
}

export class PayoutOptionInactiveError extends AppError {
  constructor() {
    super(
      "Payout option is currently inactive",
      "PAYOUT_OPTION_INACTIVE",
      400
    );
  }
}

export class InvalidPayoutDetailsError extends AppError {
  constructor() {
    super(
      "Invalid payout details",
      "INVALID_PAYOUT_DETAILS",
      400
    );
  }
}

export class WithdrawalNotFoundError extends AppError {
  constructor() {
    super(
      "Withdrawal not found",
      "WITHDRAWAL_NOT_FOUND",
      404
    );
  }
}