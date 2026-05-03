import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AccountSetting from "../models/AccountSetting.js";
import AccountLimit from "../models/AccountLimit.js";

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ 
      fullName: name, 
      email: email.toLowerCase(), 
      passwordHash: password 
    });

    await AccountSetting.create({ userId: user._id });
    await AccountLimit.create({ userId: user._id });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Error at register endpoint:", err);
    return res.status(500).json({ message: "Server error at register endpoint" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    // Set JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    console.error("Error at login endpoint:", err);
    return res.status(500).json({ message: "Server error at login endpoint" });
  }
};

// GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    // req.userId is populated by the authMiddleware
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error at profile endpoint:", err);
    return res.status(500).json({ message: "Server error at profile endpoint" });
  }
};
