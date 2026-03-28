import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../config/TryCatch.js";
import { User } from "../model/User.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:rateLimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        return res.status(429).json({
            message: "Too many requests, Please wait before requesting new OTP",
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300,
    });
    await redisClient.set(rateLimitKey, "true", {
        EX: 60,
    });
    const message = {
        to: email,
        subject: "Your otp code",
        body: `Your otp is ${otp}. It is valid for 5 minutes only.`,
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({
        message: "Otp sent to your mail",
    });
});
export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        return res.status(400).json({
            message: "Email or otp Required",
        });
    }
    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || storedOtp !== enteredOtp) {
        return res.status(400).json({
            message: "Invalid otp or expired otp",
        });
    }
    await redisClient.del(otpKey);
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, 8);
        user = await User.create({ name, email });
    }
    const token = generateToken(user);
    res.json({
        message: "User Verified",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const updateName = TryCatch(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({
            message: "Please Login",
        });
    }
    user.name = req.body.name;
    await user.save();
    const token = generateToken(user);
    res.status(200).json({
        message: "User Updated",
        user,
        token,
    });
});
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        message: "All users retrieved",
        users,
    });
});
export const getUser = TryCatch(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    res.status(200).json({
        message: "User retrieved",
        user,
    });
});
//# sourceMappingURL=user.js.map