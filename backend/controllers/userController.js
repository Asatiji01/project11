import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

// Register Controller
export const registerControllers = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        // Validate email format (basic regex check)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // Validate password complexity (e.g., minimum length of 6)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 6 characters",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user: newUser,
        });
    } catch (err) {
        console.error("Error in register controller:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Login Controller
export const loginControllers = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });
    } catch (err) {
        console.error("Error in login controller:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Set Avatar Controller
export const setAvatarController = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const imageData = req.body.image;

        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: "No image data provided",
            });
        }

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        }, { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (err) {
        console.error("Error in set avatar controller:", err);
        next(err); // Pass the error to the next middleware
    }
};

// All Users Controller
export const allUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } })
            .select(["email", "name", "avatarImage", "_id"]);

        return res.json(users);
    } catch (err) {
        console.error("Error in fetching all users:", err);
        next(err); // Pass the error to the next middleware
    }
};
