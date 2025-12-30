import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert user (✅ CORRECT COLUMN NAME)
    await db.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({
      error: "Server error during registration",
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Get user with password hash
    const [users] = await db.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      error: "Server error during login",
    });
  }
};

/**
 * GET CURRENT USER
 */
export const getMe = async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: users[0],
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};
