import mongoose from "mongoose";

import {
    creditWalletInTransaction,
    debitWalletInTransaction
} from "./walletService.js";

import { createAuditLog } from "./auditLogService.js";

export const adminCreditWallet = async ({
    adminId,
    userId,
    currency,
    amount,
    description = null
}) => {
    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            result = await creditWalletInTransaction({
                userId,
                currency,
                amount,
                type: "ADMIN_CREDIT",
                source: "ADMIN",
                description: description || "Admin wallet credit",
                session
            });

            await createAuditLog({
                actorId: adminId,
                action: "WALLET_CREDIT",
                targetUserId: userId,
                targetType: "Wallet",
                referenceId: result.transaction.transactionId,
                metadata: {
                    currency,
                    amount,
                    transactionId: result.transaction.transactionId,
                    description: description || "Admin wallet credit"
                },
                session
            });
        });

        return {
            wallet: result.wallet.toObject(),
            transaction: result.transaction.toObject()
        };
    } finally {
        await session.endSession();
    }
};

export const adminDebitWallet = async ({
    adminId,
    userId,
    currency,
    amount,
    description = null
}) => {
    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            result = await debitWalletInTransaction({
                userId,
                currency,
                amount,
                type: "ADMIN_DEBIT",
                source: "ADMIN",
                description: description || "Admin wallet debit",
                session
            });

            await createAuditLog({
                actorId: adminId,
                action: "WALLET_DEBIT",
                targetUserId: userId,
                targetType: "Wallet",
                referenceId: result.transaction.transactionId,
                metadata: {
                    currency,
                    amount,
                    transactionId: result.transaction.transactionId,
                    description: description || "Admin wallet debit"
                },
                session
            });
        });

        return {
            wallet: result.wallet.toObject(),
            transaction: result.transaction.toObject()
        };
    } finally {
        await session.endSession();
    }
};