const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { products, services, members } = require('./data.js');

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = 'your-super-secret-jwt-key-change-in-prod'; // Change in production

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/products', async (req, res) => {
  const data = await prisma.product.findMany();
  res.json(data);
});

app.get('/api/services', async (req, res) => {
  const data = await prisma.service.findMany();
  res.json(data);
});

app.get('/api/members', async (req, res) => {
  const data = await prisma.member.findMany();
  res.json(data);
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Auto-create user on first login (mock)
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: { email, password: hashedPassword }
      });
    } else {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await prisma.contact.create({
      data: { name, email, message }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
