import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../errors/AppError.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Authentication required",
                "AUTHENTICATION_REQUIRED",
                401
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError(
                "Authentication required",
                "AUTHENTICATION_REQUIRED",
                401
            );
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new AppError(
                "Invalid or expired token",
                "INVALID_TOKEN",
                401
            );
        }

        const user = await User.findById(decoded.userId)
            .select("_id email role accountStatus walletId");

        if (!user) {
            throw new AppError(
                "User not found",
                "USER_NOT_FOUND",
                401
            );
        }

        if (user.accountStatus !== "ACTIVE") {
            throw new AppError(
                "Account is not active",
                "ACCOUNT_NOT_ACTIVE",
                403
            );
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;