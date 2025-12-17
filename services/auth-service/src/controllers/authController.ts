import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import { RegisterRequest, LoginRequest, JWTPayload } from '../types';
import { validateEmail, validatePassword } from '../utils/validation';

export const register = async (req: Request, res: Response) => {
  try {
const { username, email, password }: RegisterRequest = req.body;

    // TODO: Add validation
if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
}

if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password does not meet requirements' });
}
    // TODO: Check if user exists
const checkResult = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
);

const userExists = checkResult.rows.length > 0;

if (userExists) {  // Check FIRST
    return res.status(409).json({ error: 'Email already taken' });
}

// THEN hash (only if user doesn't exist)
const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Insert user into database
const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, hashedPassword]
);
const newUser = result.rows[0];

    // TODO: Return user info (without password)
res.status(201).json({ 
    message: 'User registered successfully',
    user: newUser  // This contains id, username, email, created_at (no password!)
});
  } catch (error) {  // ← Need this!
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // TODO: Validate input
    // TODO: Find user by email
    // TODO: Compare passwords
    // TODO: Generate JWT
    // TODO: Return token and user info

    res.status(200).json({ message: 'Login endpoint - to be implemented' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};