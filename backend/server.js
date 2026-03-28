const express = require('express');
const cors = require('cors');
const { run, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── POST /submit ─────────────────────────────────────────────────────────────
// Body: { name, phone, selectedCards: number[], slot1CardId?, slot1CardTitle?, slot2CardId?, slot2CardTitle? }
app.post('/submit', async (req, res) => {
  const { name, phone, selectedCards, slot1CardId, slot1CardTitle, slot2CardId, slot2CardTitle } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required.' });
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ error: 'phone is required.' });
  }
  if (!Array.isArray(selectedCards) || selectedCards.length === 0) {
    return res.status(400).json({ error: 'selectedCards must be a non-empty array.' });
  }
  if (selectedCards.length > 2) {
    return res.status(400).json({ error: 'Maximum 2 cards can be selected.' });
  }

  try {
    const result = await run(
      `INSERT INTO users
         (name, phone, selectedCards, slot1CardId, slot1CardTitle, slot2CardId, slot2CardTitle)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        phone.trim(),
        JSON.stringify(selectedCards),
        slot1CardId   ?? null,
        slot1CardTitle ?? null,
        slot2CardId   ?? null,
        slot2CardTitle ?? null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to THILINOMICE.',
      id: result.lastID,
    });
  } catch (err) {
    console.error('POST /submit error:', err.message);
    res.status(500).json({ error: 'Failed to save submission.' });
  }
});

// ─── GET /data ────────────────────────────────────────────────────────────────
// Returns all user records with selectedCards parsed back to array.
app.get('/data', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM users ORDER BY createdAt DESC');

    const users = rows.map((row) => ({
      ...row,
      selectedCards: (() => {
        try { return JSON.parse(row.selectedCards); }
        catch { return []; }
      })(),
    }));

    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error('GET /data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

// ─── DELETE /data/:id ────────────────────────────────────────────────────────
app.delete('/data/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await run('DELETE FROM users WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Record not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /data/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

// ─── GET / ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    app: 'THILINOMICE Backend',
    status: 'running',
    endpoints: {
      submit: 'POST /submit',
      data:   'GET  /data',
      health: 'GET  /health',
    },
  });
});

// ─── GET /health + /healthz ───────────────────────────────────────────────────
const healthHandler = (_req, res) => {
  res.json({ status: 'ok', app: 'THILINOMICE', version: '2.0.0' });
};
app.get('/health', healthHandler);
app.get('/healthz', healthHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nTHILINOMICE backend running on port ${PORT}`);
  console.log(`  POST /submit  — save a registration`);
  console.log(`  GET  /data    — fetch all registrations`);
  console.log(`  GET  /health  — health check\n`);
});
