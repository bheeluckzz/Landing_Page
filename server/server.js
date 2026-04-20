const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { 
  products, services, members, 
  findUserByEmail, createUser, updateUser, hashPassword, verifyPassword,
  createContact, createItem, updateItem, deleteItem, findItemById, searchItems 
} = require('./data.js');

const app = express();

const JWT_SECRET = 'your-super-secret-jwt-key-change-in-prod'; // Change in production

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Static data endpoints (read-only)
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/members', (req, res) => {
  res.json(members);
});

// New auth endpoints structure
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }
    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = createUser({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = updateUser(req.user.userId, {}); // Just fetch
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      email: user.email,
      created: user.created
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// New contact endpoint
app.post('/api/contact/submit', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    createContact({ name, email, message });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// New items endpoints (renamed from objects, full CRUD + pagination/search)
app.get('/api/items', (req, res) => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    const result = searchItems({ search: search || '', page, limit });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { name, data } = req.body;
    const item = createItem({ name, ...data });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, data } = req.body;
    const item = updateItem(id, { name, ...data });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!deleteItem(id)) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('New endpoints: /api/items (CRUD), /api/auth/*, /api/contact/submit, /api/health');
});

