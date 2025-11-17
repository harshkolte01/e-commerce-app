const { PrismaClient } = require('../generated/prisma');
const Product = require('../models/product.model');

const prisma = new PrismaClient();

const getDailyRevenue = async (days = 30) => {
  const query = `
    SELECT
      DATE(o."createdAt") as date,
      SUM(o.total) as revenue,
      COUNT(o.id) as orders
    FROM "Order" o
    WHERE o."createdAt" >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(o."createdAt")
    ORDER BY date DESC
  `;
  
  const rows = await prisma.$queryRawUnsafe(query);
  
  // Convert BigInt values to strings for JSON serialization
  return rows.map(row => ({
    date: row.date,
    revenue: row.revenue ? row.revenue.toString() : '0',
    orders: row.orders ? row.orders.toString() : '0'
  }));
};

const getTopCustomers = async (limit = 10) => {
  const query = `
    SELECT
      u.name,
      u.email,
      COUNT(o.id) as total_orders,
      SUM(o.total) as total_spent
    FROM "User" u
    JOIN "Order" o ON u.id = o."userId"
    WHERE u.role = 'customer'
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT ${limit}
  `;
  
  const rows = await prisma.$queryRawUnsafe(query);
  
  // Convert BigInt values to strings for JSON serialization
  return rows.map(row => ({
    name: row.name,
    email: row.email,
    total_orders: row.total_orders ? row.total_orders.toString() : '0',
    total_spent: row.total_spent ? row.total_spent.toString() : '0'
  }));
};

const getCategorySummary = async () => {
  const pipeline = [
    {
      $group: {
        _id: '$category',
        total_products: { $sum: 1 },
        total_stock: { $sum: '$stock' },
        avg_price: { $avg: '$price' },
        min_price: { $min: '$price' },
        max_price: { $max: '$price' }
      }
    },
    {
      $project: {
        category: '$_id',
        total_products: 1,
        total_stock: 1,
        avg_price: { $round: ['$avg_price', 2] },
        min_price: 1,
        max_price: 1,
        _id: 0
      }
    },
    {
      $sort: { total_products: -1 }
    }
  ];

  const rows = await Product.aggregate(pipeline);
  return rows;
};

module.exports = {
  getDailyRevenue,
  getTopCustomers,
  getCategorySummary
};