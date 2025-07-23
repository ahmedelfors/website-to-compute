const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database');
});

db.run(`CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, role TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS registrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, phone TEXT, activity TEXT, days TEXT, timing TEXT, time TEXT, start TEXT, end TEXT, cash REAL, network REAL, remaining REAL, uniform TEXT, notes TEXT, level INTEGER, coach TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS coaches (name TEXT PRIMARY KEY)`);

db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('Ahmed', 'ASDasd77', 'admin'), ('Aya', 'A123123', 'aya'), ('user1', '123123', 'employee')`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else if (row) res.json({ username: row.username, role: row.role });
    else res.status(401).json({ error: 'Invalid credentials' });
  });
});

app.get('/api/registrations', (req, res) => {
  db.all(`SELECT * FROM registrations`, [], (err, rows) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else res.json(rows);
  });
});

app.post('/api/registrations', (req, res) => {
  const data = req.body;
  db.run(`INSERT INTO registrations (name, age, phone, activity, days, timing, time, start, end, cash, network, remaining, uniform, notes, level, coach) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.age, data.phone, data.activity, data.days, data.timing, data.time, data.start, data.end, data.cash, data.network, data.remaining, data.uniform, data.notes, data.level, data.coach], (err) => {
      if (err) res.status(500).json({ error: 'Database error' });
      else res.json({ success: true });
    });
});

app.put('/api/registrations/:id', (req, res) => {
  const data = req.body;
  db.run(`UPDATE registrations SET name = ?, age = ?, phone = ?, activity = ?, days = ?, timing = ?, time = ?, start = ?, end = ?, cash = ?, network = ?, remaining = ?, uniform = ?, notes = ?, level = ?, coach = ? WHERE id = ?`,
    [data.name, data.age, data.phone, data.activity, data.days, data.timing, data.time, data.start, data.end, data.cash, data.network, data.remaining, data.uniform, data.notes, data.level, data.coach, req.params.id], (err) => {
      if (err) res.status(500).json({ error: 'Database error' });
      else res.json({ success: true });
    });
});

app.delete('/api/registrations/:id', (req, res) => {
  db.run(`DELETE FROM registrations WHERE id = ?`, [req.params.id], (err) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else res.json({ success: true });
  });
});

app.get('/api/coaches', (req, res) => {
  db.all(`SELECT * FROM coaches`, [], (err, rows) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else res.json(rows.map(row => row.name));
  });
});

app.post('/api/coaches', (req, res) => {
  const { name } = req.body;
  db.run(`INSERT OR IGNORE INTO coaches (name) VALUES (?)`, [name], (err) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else res.json({ success: true });
  });
});

app.delete('/api/coaches/:name', (req, res) => {
  db.run(`DELETE FROM coaches WHERE name = ?`, [req.params.name], (err) => {
    if (err) res.status(500).json({ error: 'Database error' });
    else res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));