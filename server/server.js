const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Тестовый роут
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});