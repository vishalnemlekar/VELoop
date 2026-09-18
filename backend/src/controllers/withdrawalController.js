import {
    createWithdrawal,
    getWithdrawal,
    getWithdrawals
} from "../services/withdrawalService.js";
import {
    validateCreateWithdrawalRequest
} from "../validators/withdrawalRequestValidators.js";
import { getActivePayoutOptions } from "../services/payoutOptionService.js";

export const getPayoutOptionsController = async (req, res, next) => {
    try {
        const options = await getActivePayoutOptions();

        res.status(200).json({
            success: true,
            data: options
        });
    } catch (error) {
        next(error);
    }
};
export const createWithdrawalController = async (req, res, next) => {
    try {
        const idempotencyKey = req.headers["idempotency-key"];

        validateCreateWithdrawalRequest({
            optionId: req.body.optionId,
            payoutDetails: req.body.payoutDetails,
            idempotencyKey
        });

        const result = await createWithdrawal({
            userId: req.user._id,
            optionId: req.body.optionId,
            payoutDetails: req.body.payoutDetails,
            idempotencyKey
        });

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getWithdrawalController = async (req, res, next) => {
    try {
        const result = await getWithdrawal(
            req.user._id,
            req.params.withdrawalId
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getWithdrawalsController = async (req, res, next) => {
    try {
        const result = await getWithdrawals({
            userId: req.user._id,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 20,
            status: req.query.status || null
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};