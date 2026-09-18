import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { reconcileWallet } from "../services/reconciliationService.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/:userId", async (req, res, next) => {
    try {
        const result = await reconcileWallet(req.params.userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
});

export default router;