const UserModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
    try {
        //extract user information from our request body
        const { username, email, password, role } = req.body;

        //check if the user already exist in database
        const checkExistingUser = await UserModel.findOne({
            $or: [{ username }, { email }],
        });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already exists",
            });
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user and save

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        //save user
        await newUser.save();

        if (newUser) {
            res.status(201).json({
                success: true,
                message: "New user created successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to register new user",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

//login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //find if the current user is exists in database
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        //if the password is correct or not
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        //create user token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m",
            },
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken: accessToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        //extract old and new password
        const { oldPassword, newPassword } = req.body;

        //find the current logged in user
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }

        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            user.password,
        );

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct please try again",
            });
        }

        //hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        //update user password
        user.password = newHashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Change password error",
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser, changePassword };
