import WalletTransaction from "../models/WalletTransaction.js";
import { CURRENCIES, CURRENCY_FIELD_MAP } from "../constants/enums.js";
import { WalletNotFoundError } from "../errors/WalletErrors.js";
import Wallet from "../models/Wallet.js";
import User from "../models/User.js";

export const reconcileWallet = async (userId) => {
    const user = await User.findById(userId).select("walletId");

    if (!user || !user.walletId) {
        throw new WalletNotFoundError();
    }

    const wallet = await Wallet.findOne({
        _id: user.walletId,
        userId: user._id
    }).lean();

    if (!wallet) {
        throw new WalletNotFoundError();
    }

    const ledgerTotals = await WalletTransaction.aggregate([
        {
            $match: {
                userId: user._id,
                walletId: wallet._id
            }
        },
        {
            $group: {
                _id: "$currency",
                credits: {
                    $sum: {
                        $cond: [
                            { $eq: ["$direction", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                debits: {
                    $sum: {
                        $cond: [
                            { $eq: ["$direction", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const ledgerMap = new Map(
        ledgerTotals.map((item) => [
            item._id,
            {
                credits: item.credits,
                debits: item.debits
            }
        ])
    );

    const currencies = {};

    for (const currency of CURRENCIES) {
        const walletField = CURRENCY_FIELD_MAP[currency];

        const walletBalance = wallet[walletField] || 0;

        const ledger = ledgerMap.get(currency) || {
            credits: 0,
            debits: 0
        };

        const ledgerBalance = ledger.credits - ledger.debits;
        const difference = walletBalance - ledgerBalance;

        currencies[currency] = {
            walletBalance,
            ledgerCredits: ledger.credits,
            ledgerDebits: ledger.debits,
            ledgerBalance,
            difference,
            status: difference === 0 ? "MATCH" : "MISMATCH"
        };
    }

    const reconciled = Object.values(currencies).every(
        (currency) => currency.status === "MATCH"
    );

    return {
        userId: user._id,
        walletId: wallet._id,
        reconciled,
        currencies
    };
};