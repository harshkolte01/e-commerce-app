require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  mongodbUrl: process.env.MONGODB_URL,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
  jwtSecret: process.env.JWT_SECRET,
  expiryTime: process.env.EXPIRY_TIME
};