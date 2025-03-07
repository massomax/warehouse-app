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
  .catch(err => console.log(err))

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const regRoutes = require('./routes/auth')
app.use('/api/register', regRoutes)

const materialRoutes = require('./routes/materialRoutes')
app.use('/api/materials', materialRoutes)

const historyRoutes = require('./routes/historyRoutes');
app.use('/api/history', historyRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const warehouseRoutes = require('./routes/warehouseRoutes');
const warehouseAccessRoutes = require('./routes/warehouseAccessRoutes');
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/warehouse-access', warehouseAccessRoutes);


// Тестовый роут
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});