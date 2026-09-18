import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import AppError from "../errors/AppError.js";
import mongoose from "mongoose";

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

export const register = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const { email, name, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof name !== "string" ||
            typeof password !== "string"
        ) {
            throw new AppError(
                "Email, name and password are required",
                "INVALID_REGISTRATION_DATA",
                400
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !name.trim() || password.length < 8) {
            throw new AppError(
                "Invalid registration data",
                "INVALID_REGISTRATION_DATA",
                400
            );
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            throw new AppError(
                "Email already registered",
                "EMAIL_ALREADY_REGISTERED",
                409
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        let user;
        let wallet;

        await session.withTransaction(async () => {
            [user] = await User.create(
                [
                    {
                        email: normalizedEmail,
                        name: name.trim(),
                        passwordHash
                    }
                ],
                { session }
            );

            [wallet] = await Wallet.create(
                [
                    {
                        userId: user._id
                    }
                ],
                { session }
            );

            user.walletId = wallet._id;

            await user.save({ session });
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    accountStatus: user.accountStatus
                },
                token
            }
        });
    } catch (error) {
        next(error);
    } finally {
        await session.endSession();
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            throw new AppError(
                "Email and password are required",
                "INVALID_LOGIN_DATA",
                400
            );
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+passwordHash");

        if (!user) {
            throw new AppError(
                "Invalid email or password",
                "INVALID_CREDENTIALS",
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

        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordValid) {
            throw new AppError(
                "Invalid email or password",
                "INVALID_CREDENTIALS",
                401
            );
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    accountStatus: user.accountStatus
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};