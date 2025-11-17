require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  mongodbUrl: process.env.MONGODB_URL,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  jwtSecret: process.env.JWT_SECRET
};