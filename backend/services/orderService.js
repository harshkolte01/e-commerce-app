const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const listOrdersForUser = async (userId, { page, limit, fromDate, toDate }) => {
  const where = { userId };

  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) where.createdAt.gte = new Date(fromDate);
    if (toDate) where.createdAt.lte = new Date(toDate);
  }

  const skip = (page - 1) * limit;

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        items: true
      }
    })
  ]);

  const items = orders.map(order => ({
    id: order.id,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items.length
  }));

  return { items, total };
};

const getOrderById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true
    }
  });
};

module.exports = {
  listOrdersForUser,
  getOrderById
};