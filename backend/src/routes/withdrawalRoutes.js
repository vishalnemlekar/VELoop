import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createWithdrawalController,
    getWithdrawalController,
    getWithdrawalsController,
    getPayoutOptionsController
} from "../controllers/withdrawalController.js";

import { withdrawalRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/payout-options", getPayoutOptionsController);

router.post("/", withdrawalRateLimiter, createWithdrawalController);

router.get("/", getWithdrawalsController);

router.get("/:withdrawalId", getWithdrawalController);

export default router;