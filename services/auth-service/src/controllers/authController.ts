import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../utils/db";
import { RegisterRequest, LoginRequest, JWTPayload } from "../types";
import { validateEmail, validatePassword } from "../utils/validation";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    // TODO: Add validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ error: "Password does not meet requirements" });
    }
    // TODO: Check if user exists
    const checkResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const userExists = checkResult.rows.length > 0;

    if (userExists) {
      // Check FIRST
      return res.status(409).json({ error: "Email already taken" });
    }

    // THEN hash (only if user doesn't exist)
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Insert user into database
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );
    const newUser = result.rows[0];

    // TODO: Return user info (without password)
    res.status(201).json({
      message: "User registered successfully",
      user: newUser, // This contains id, username, email, created_at (no password!)
    });
  } catch (error) {
    // ← Need this!
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Find user by email
    const result = await pool.query(
      "SELECT id, email, username, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token with 7-day expiration
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Return token and user info (without password)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
