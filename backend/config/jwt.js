const jwt = require('jsonwebtoken');
const config = require('./index');

const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.expiryTime,
    issuer: 'ecomm-backend'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret, {
      issuer: 'ecomm-backend'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const refreshToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.expiryTime,
    issuer: 'ecomm-backend'
  });
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken
};