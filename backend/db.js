const { Pool } = require("pg")

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports = pool