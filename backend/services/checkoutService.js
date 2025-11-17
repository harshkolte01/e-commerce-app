const { PrismaClient } = require('../generated/prisma');
const productService = require('./productService');

const prisma = new PrismaClient();

const createOrder = async (userId, items) => {
  const productIds = items.map(item => item.productId);
  const products = await productService.findByIds(productIds);

  if (products.length !== items.length) {
    throw new Error('Some products not found');
  }

  const productMap = new Map();
  products.forEach(product => {
    productMap.set(product._id.toString(), product);
    productMap.set(product.sku, product);
  });

  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.push({
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      priceAtPurchase: product.price
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    for (const item of items) {
      await productService.decrementStock(item.productId, item.quantity);
    }

    return order;
  });

  return result;
};

module.exports = {
  createOrder
};