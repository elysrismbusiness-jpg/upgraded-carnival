const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json({ limit: '1mb' }));

const canonicalHost = process.env.CANONICAL_HOST || 'dispulse.co';
app.use((req, res, next) => {
  const host = req.hostname;
  if (!host) {
    return next();
  }

  const isLocalhost = host === 'localhost' || host === '127.0.0.1';
  if (!isLocalhost && host !== canonicalHost) {
    return res.redirect(301, `https://${canonicalHost}${req.originalUrl}`);
  }

  return next();
});

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const seedUsersFromEnv = () => {
  const raw = process.env.OWNER_USERS;
  if (!raw) {
    return;
  }

  let users;
  try {
    users = JSON.parse(raw);
  } catch {
    console.warn('Invalid OWNER_USERS JSON.');
    return;
  }

  if (!Array.isArray(users)) {
    console.warn('OWNER_USERS must be a JSON array.');
    return;
  }

  const selectUser = db.prepare('SELECT id FROM users WHERE email = ?');
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  );

  users.forEach((user) => {
    if (!user?.email || !user?.password || !user?.name) {
      return;
    }

    const existing = selectUser.get(user.email);
    if (existing) {
      return;
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.name, user.email, passwordHash, user.role || 'owner');
  });
};

seedUsersFromEnv();

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = db
    .prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ?')
    .get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role },
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

app.get('/api/content', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM content').all();
  const entries = rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
  return res.json({ entries });
});

app.post('/api/content/seed', (req, res) => {
  const entries = req.body?.entries;
  if (!entries || typeof entries !== 'object') {
    return res.status(400).json({ error: 'Entries required' });
  }

  const insert = db.prepare(
    'INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO NOTHING'
  );
  const now = new Date().toISOString();
  const keys = Object.keys(entries);

  const insertMany = db.transaction(() => {
    keys.forEach((key) => {
      insert.run(key, entries[key], now);
    });
  });

  insertMany();

  return res.json({ inserted: keys.length });
});

app.put('/api/content/:key', requireAuth, (req, res) => {
  const key = req.params.key;
  const value = req.body?.value;

  if (!key) {
    return res.status(400).json({ error: 'Key required' });
  }

  if (typeof value !== 'string') {
    return res.status(400).json({ error: 'Value must be a string' });
  }

  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  ).run(key, value, now);

  return res.json({ key, value });
});

const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(404).send('Not built yet.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
