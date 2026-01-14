const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your-secret-key'; // In production, use environment variable

app.use(cors());
app.use(bodyParser.json());

// Mock users
const users = [
  { id: 1, username: 'user', password: bcrypt.hashSync('password', 8), role: 'user' },
  { id: 2, username: 'admin', password: bcrypt.hashSync('admin', 8), role: 'admin' }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: 86400 });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware to check role
const checkRole = (role) => (req, res, next) => {
  if (req.userRole !== role && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Require ' + role + ' role' });
  }
  next();
};

// Protected routes
app.get('/api/protected/user', verifyToken, (req, res) => {
  res.json({ message: 'This is user content' });
});

app.get('/api/protected/admin', verifyToken, checkRole('admin'), (req, res) => {
  res.json({ message: 'This is admin content' });
});

// Stock API (mock)
let stocks = [
  { id: 1, name: 'AAPL', price: 150 },
  { id: 2, name: 'GOOGL', price: 2800 }
];

app.get('/api/stocks', verifyToken, (req, res) => {
  res.json(stocks);
});

// Portfolio API (admin only)
let portfolio = [
  { id: 1, stockId: 1, quantity: 10, userId: 2 }
];

app.get('/api/portfolio', verifyToken, checkRole('admin'), (req, res) => {
  res.json(portfolio);
});

app.post('/api/portfolio', verifyToken, checkRole('admin'), (req, res) => {
  const newEntry = { id: portfolio.length + 1, ...req.body };
  portfolio.push(newEntry);
  res.json(newEntry);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});