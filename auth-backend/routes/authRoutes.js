const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/verify", authMiddleware, (req, res) => {
    res.json({ isUserLoggedIn: true, user: req.user });
});

module.exports = router;
