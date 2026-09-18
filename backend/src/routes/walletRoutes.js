import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getWalletController,
    getWalletSummaryController,
    getWalletTransactionsController
} from "../controllers/walletController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWalletController);

router.get("/transactions", getWalletTransactionsController);

router.get("/summary", getWalletSummaryController);

export default router;