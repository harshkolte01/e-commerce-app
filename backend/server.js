const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const connectMongoDB = require('./config/MongoDB');
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoute');
const checkoutRoutes = require('./routes/checkoutRoute');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);

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