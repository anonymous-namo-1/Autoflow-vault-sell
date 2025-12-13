import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { randomInt } from "crypto";
import { storage } from "./storage";
import { registerSchema, loginSchema, verifyOtpSchema, resetPasswordSchema, forgotPasswordSchema } from "@shared/schema";
import "./types";

const router = Router();

function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

function getExpirationTime(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Register
router.post("/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }

    const { email, password, name } = result.data;

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      name,
      isVerified: false,
      isAdmin: false,
    });

    const otp = generateOTP();
    await storage.createOtpToken({
      userId: user.id,
      email: user.email,
      code: otp,
      type: "email_verification",
      expiresAt: getExpirationTime(15),
    });

    console.log(`[DEV] Verification OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: "Account created. Please check your email for verification code.",
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to create account" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }

    const { email, password } = result.data;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        needsVerification: true,
        email: user.email
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    if (req.session) {
      req.session.userId = user.id;
    }

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to log in" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const result = verifyOtpSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }

    const { email, code } = result.data;

    const token = await storage.getValidOtpToken(email, code, "email_verification");
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    await storage.markOtpTokenUsed(token.id);

    const user = await storage.getUserByEmail(email);
    if (user) {
      await storage.updateUser(user.id, { isVerified: true });
    }

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Failed to verify email" });
  }
});

// Resend verification OTP
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const otp = generateOTP();
    await storage.createOtpToken({
      userId: user.id,
      email: user.email,
      code: otp,
      type: "email_verification",
      expiresAt: getExpirationTime(15),
    });

    console.log(`[DEV] Verification OTP for ${email}: ${otp}`);

    res.json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Failed to resend verification code" });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }

    const { email } = result.data;

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.json({ message: "If an account exists, a reset code has been sent" });
    }

    const otp = generateOTP();
    await storage.createOtpToken({
      userId: user.id,
      email: user.email,
      code: otp,
      type: "password_reset",
      expiresAt: getExpirationTime(15),
    });

    console.log(`[DEV] Password reset OTP for ${email}: ${otp}`);

    res.json({ message: "If an account exists, a reset code has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.errors[0].message });
    }

    const { email, code, newPassword } = result.data;

    const token = await storage.getValidOtpToken(email, code, "password_reset");
    if (!token) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    await storage.markOtpTokenUsed(token.id);

    const user = await storage.getUserByEmail(email);
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword });
    }

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

export default router;
