const { PrismaClient } = require('../generated/prisma');
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const connectMongoDB = require('../config/MongoDB');

const prisma = new PrismaClient();

// Product SKUs from seedProducts.js
const productSKUs = [
  'ELEC-001', 'ELEC-002', 'ELEC-003', 'ELEC-004', 'ELEC-005', 'ELEC-006', 'ELEC-007',
  'APP-001', 'APP-002', 'APP-003', 'APP-004', 'APP-005', 'APP-006', 'APP-007',
  'GAM-001', 'GAM-002', 'GAM-003', 'GAM-004', 'GAM-005', 'GAM-006'
];

// Customer user IDs (excluding admins)
const customerEmails = [
  'user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com',
  'user5@example.com', 'user6@example.com', 'user7@example.com', 'user8@example.com',
  'user9@example.com', 'user10@example.com', 'user11@example.com', 'user12@example.com',
  'user13@example.com'
];

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateOrders = () => {
  const orders = [];
  const startDate = new Date('2025-11-01');
  const endDate = new Date('2025-11-18');

  for (let i = 1; i <= 50; i++) {
    const customerEmail = getRandomElement(customerEmails);
    const orderDate = getRandomDate(startDate, endDate);
    
    // Generate 1-4 items per order
    const itemCount = getRandomNumber(1, 4);
    const orderItems = [];
    let orderTotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const productSku = getRandomElement(productSKUs);
      const quantity = getRandomNumber(1, 3);
      
      // Avoid duplicate products in same order
      if (!orderItems.find(item => item.productId === productSku)) {
        orderItems.push({
          productId: productSku,
          quantity: quantity
        });
      }
    }

    orders.push({
      customerEmail,
      items: orderItems,
      createdAt: orderDate
    });
  }

  return orders;
};

const seedOrders = async () => {
  try {
    // Connect to both databases
    await connectMongoDB();
    
    console.log('Starting order seeding...');

    // Get users and products
    const users = await prisma.user.findMany({
      where: { role: 'customer' }
    });

    const products = await Product.find({});
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product.sku, product);
    });

    if (users.length === 0) {
      throw new Error('No customer users found. Please run seedUsers.js first.');
    }

    if (products.length === 0) {
      throw new Error('No products found. Please run seedProducts.js first.');
    }

    // Generate orders
    const orderData = generateOrders();
    let createdOrders = 0;

    for (const orderInfo of orderData) {
      try {
        // Find user by email
        const user = users.find(u => u.email === orderInfo.customerEmail);
        if (!user) continue;

        // Calculate order total and prepare order items
        let total = 0;
        const validOrderItems = [];

        for (const item of orderInfo.items) {
          const product = productMap.get(item.productId);
          if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            validOrderItems.push({
              productId: item.productId,
              productName: product.name,
              quantity: item.quantity,
              priceAtPurchase: product.price
            });
          }
        }

        if (validOrderItems.length > 0) {
          // Create order with items
          await prisma.order.create({
            data: {
              userId: user.id,
              total: total,
              createdAt: orderInfo.createdAt,
              items: {
                create: validOrderItems
              }
            }
          });
          createdOrders++;
        }
      } catch (error) {
        console.error(`Error creating order: ${error.message}`);
      }
    }

    console.log(`Successfully created ${createdOrders} orders with order items`);

    // Display summary
    const totalOrders = await prisma.order.count();
    const totalOrderItems = await prisma.orderItem.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true }
    });

    console.log('\n=== ORDER SEEDING SUMMARY ===');
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Total Order Items: ${totalOrderItems}`);
    console.log(`Total Revenue: ₹${totalRevenue._sum.total?.toFixed(2) || 0}`);
    console.log('=============================\n');

  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await prisma.$disconnect();
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedOrders();
}

module.exports = seedOrders;