import AppError from "../errors/AppError.js";

const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError(
                "Authentication required",
                "AUTHENTICATION_REQUIRED",
                401
            );
        }

        if (req.user.role !== "ADMIN") {
            throw new AppError(
                "Admin access required",
                "ADMIN_ACCESS_REQUIRED",
                403
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default adminMiddleware;