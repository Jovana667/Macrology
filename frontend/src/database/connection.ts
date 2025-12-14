// db/connection.ts
// Database connection module with connection pooling for PostgreSQL

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'macrology_dev',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  // Pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'macrology_dev');
    
    // Test with a simple query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database server time:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Query function with error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (optional - helpful for optimization)
    if (duration > 100) {
      console.log('⚠️ Slow query detected:', {
        query: text,
        duration: duration + 'ms',
        rows: result.rowCount
      });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', {
      query: text,
      error: error
    });
    throw error;
  }
};

// Get a client from the pool (for transactions)
export const getClient = async () => {
  const client = await pool.connect();
  
  // Wrapper to ensure client is released even if error occurs
  return {
    client,
    release: () => client.release(),
    
    // Transaction helper methods
    beginTransaction: () => client.query('BEGIN'),
    commit: () => client.query('COMMIT'),
    rollback: () => client.query('ROLLBACK'),
  };
};

// Graceful shutdown
export const closePool = async () => {
  try {
    await pool.end();
    console.log('📴 Database pool closed successfully');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

export default pool;