const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyOtp, resendOtp, googleLogin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a user
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login a user
router.post("/login", login);

// @route   POST /api/auth/google
// @desc    Google Login
router.post("/google", googleLogin);

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get("/me", protect, getMe);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for login/register (Simulated)
router.post("/verify-otp", verifyOtp);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP (Simulated)
router.post("/resend-otp", resendOtp);

module.exports = router;
