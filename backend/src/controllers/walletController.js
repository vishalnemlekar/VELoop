import {
    getWallet,
    getWalletSummary,
    getTransactions
} from "../services/walletService.js";

export const getWalletController = async (req, res, next) => {
    try {
        const result = await getWallet(req.user._id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getWalletSummaryController = async (req, res, next) => {
    try {
        const result = await getWalletSummary(req.user._id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getWalletTransactionsController = async (
    req,
    res,
    next
) => {
    try {
        const result = await getTransactions({
            userId: req.user._id,
            page: req.query.page !== undefined
    ? Number(req.query.page)
    : 1,

limit: req.query.limit !== undefined
    ? Number(req.query.limit)
    : 20,
            currency: req.query.currency || null,
            direction: req.query.direction || null
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};