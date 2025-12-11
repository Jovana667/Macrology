import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';
import { RegisterRequest, LoginRequest, JWTPayload } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password }: RegisterRequest = req.body;

    // TODO: Add validation
    // TODO: Check if user exists
    // TODO: Hash password
    // TODO: Insert user into database
    // TODO: Return user info (without password)

    res.status(201).json({ message: 'Registration endpoint - to be implemented' });
  } catch (error) {
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