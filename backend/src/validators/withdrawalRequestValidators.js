import AppError from "../errors/AppError.js";

export const validateCreateWithdrawalRequest = ({
    optionId,
    payoutDetails,
    idempotencyKey
}) => {
    if (
        typeof optionId !== "string" ||
        optionId.trim().length === 0
    ) {
        throw new AppError(
            "Payout option ID is required",
            "INVALID_OPTION_ID",
            400
        );
    }

    if (
        !payoutDetails ||
        typeof payoutDetails !== "object" ||
        Array.isArray(payoutDetails)
    ) {
        throw new AppError(
            "Payout details are required",
            "INVALID_PAYOUT_DETAILS",
            400
        );
    }

    if (
        typeof idempotencyKey !== "string" ||
        idempotencyKey.trim().length === 0
    ) {
        throw new AppError(
            "Idempotency-Key header is required",
            "IDEMPOTENCY_KEY_REQUIRED",
            400
        );
    }

    return true;
};