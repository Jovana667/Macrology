require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(
  "Testing connection with:",
  process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@")
);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connection successful!");
  console.log("Current time from database:", res.rows[0].now);
  pool.end();
  process.exit(0);
});
