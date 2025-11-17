const bcrypt = require('bcrypt');
const { PrismaClient } = require('../generated/prisma');
const config = require('../config');

const prisma = new PrismaClient();

const users = [
  { name: "admin1", email: "admin1@example.com", password: "admin1@example.com", role: "admin" },
  { name: "admin2", email: "admin2@example.com", password: "admin2@example.com", role: "admin" },
  { name: "user1", email: "user1@example.com", password: "user1@example.com", role: "customer" },
  { name: "user2", email: "user2@example.com", password: "user2@example.com", role: "customer" },
  { name: "user3", email: "user3@example.com", password: "user3@example.com", role: "customer" },
  { name: "user4", email: "user4@example.com", password: "user4@example.com", role: "customer" },
  { name: "user5", email: "user5@example.com", password: "user5@example.com", role: "customer" },
  { name: "user6", email: "user6@example.com", password: "user6@example.com", role: "customer" },
  { name: "user7", email: "user7@example.com", password: "user7@example.com", role: "customer" },
  { name: "user8", email: "user8@example.com", password: "user8@example.com", role: "customer" },
  { name: "user9", email: "user9@example.com", password: "user9@example.com", role: "customer" },
  { name: "user10", email: "user10@example.com", password: "user10@example.com", role: "customer" },
  { name: "user11", email: "user11@example.com", password: "user11@example.com", role: "customer" },
  { name: "user12", email: "user12@example.com", password: "user12@example.com", role: "customer" },
  { name: "user13", email: "user13@example.com", password: "user13@example.com", role: "customer" }
];

const seedUsers = async () => {
  try {
    await prisma.user.deleteMany();
    console.log('Cleared existing users');

    for (const userData of users) {
      const passwordHash = await bcrypt.hash(userData.password, config.bcryptSaltRounds);
      
      await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          passwordHash,
          role: userData.role
        }
      });
    }

    console.log(`Created ${users.length} users successfully`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;