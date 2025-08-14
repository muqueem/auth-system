const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get("/dashboard", (req, res) => {
    res.json({ message: `Welcome user ${req.user.username}` });
});

router.post("/update-profile", (req, res) => {
    res.json({ message: `Profile updated for ${req.user.username}` });
});


module.exports = router;
