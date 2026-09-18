import express from "express";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";
import {
    register,
    login
} from "../controllers/authController.js";



const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

export default router;