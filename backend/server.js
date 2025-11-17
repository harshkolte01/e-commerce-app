const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./generated/prisma');
const connectMongoDB = require('./config/MongoDB');
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const checkoutRoutes = require('./routes/checkoutRoute');
const orderRoutes = require('./routes/orderRoute');
const reportRoutes = require('./routes/reportRoute');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

const startServer = async () => {
  try {
    await connectMongoDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();