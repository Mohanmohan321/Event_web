const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Create table on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          TEXT    NOT NULL,
    phone         TEXT    NOT NULL,
    selected_cards TEXT   NOT NULL,
    slot1_card_id  INTEGER,
    slot1_card_title TEXT,
    slot2_card_id  INTEGER,
    slot2_card_title TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  )
`)
  .then(() => console.log('Table "users" ready.'))
  .catch((err) => { console.error('Table creation error:', err.message); process.exit(1); });

// Convert SQLite-style ? placeholders → PostgreSQL $1 $2 ...
function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

/** INSERT / UPDATE / DELETE — resolves with { lastID, changes } */
async function run(sql, params = []) {
  const res = await pool.query(toPostgres(sql), params);
  return { lastID: res.rows[0]?.id ?? null, changes: res.rowCount };
}

/** SELECT many — resolves with array of rows */
async function all(sql, params = []) {
  const res = await pool.query(toPostgres(sql), params);
  return res.rows;
}

module.exports = { run, all };
