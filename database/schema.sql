-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    protein DECIMAL(10, 2) NOT NULL,
    carbs DECIMAL(10, 2) NOT NULL,
    fat DECIMAL(10, 2) NOT NULL,
    calories DECIMAL(10, 2) NOT NULL,
    serving_size DECIMAL(10, 2) DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (protein >= 0),
    CHECK (carbs >= 0),
    CHECK (fat >= 0),
    CHECK (calories >= 0)
);

-- Create indexes for performance
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_category ON foods(category);
CREATE INDEX idx_users_email ON users(email);

-- Meals table (will add later)
-- User profiles table (will add later)
-- Meal foods junction table (will add later)