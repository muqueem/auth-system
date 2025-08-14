const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Create user
        user = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken
        });
        await user.save();

        // Simulate sending email
        const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;
        res.status(201).json({ message: "User registered successfully. Check console for verification link.", verifyLink, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) return res.status(400).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "User already verified" });

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified Successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Invalid or expired token" });
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        
        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // check if verified
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email before login", verifyLink: `http://localhost:5173/verify-email/${user.verificationToken}` });

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password", showForgotPassword: true });

        // Create token
        const payload = { id: user._id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login Successfully", token, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 mins
        await user.save();

        // simulate sending reset password email
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        console.log(`Click to reset your password: ${resetLink}`);
        
        res.json({ message: "Password reset link generated please check console for link", resetLink, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        res.status(200).json({ message: "Password has been reset successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}