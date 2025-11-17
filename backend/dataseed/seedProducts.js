const mongoose = require('mongoose');
const Product = require('../models/product.model');
const connectMongoDB = require('../config/MongoDB');

const products = [
  { sku:'ELEC-001', name:'Budget Phone X', description:'Compact phone, 3GB RAM', price:7999, category:'electronics', stock:15 },
  { sku:'ELEC-002', name:'Midphone Pro', description:'6.5" screen, 6GB RAM', price:14999, category:'electronics', stock:10 },
  { sku:'ELEC-003', name:'Wireless Earbuds A1', description:'Bluetooth 5.2', price:1999, category:'electronics', stock:40 },
  { sku:'ELEC-004', name:'USB-C Fast Charger', description:'30W charger', price:899, category:'electronics', stock:50 },
  { sku:'ELEC-005', name:'Smartwatch Lite', description:'Heart-rate monitor', price:3999, category:'electronics', stock:20 },

  { sku:'APP-001', name:'Cotton T-Shirt', description:'Unisex, size M', price:499, category:'apparel', stock:100 },
  { sku:'APP-002', name:'Hoodie Classic', description:'Warm fleece hoodie', price:1299, category:'apparel', stock:40 },
  { sku:'APP-003', name:'Running Shoes', description:'Lightweight trainer', price:2499, category:'apparel', stock:25 },
  { sku:'APP-004', name:'Baseball Cap', description:'Adjustable cap', price:399, category:'apparel', stock:80 },
  { sku:'APP-005', name:'Jeans Regular', description:'Denim, size 32', price:1499, category:'apparel', stock:30 },

  { sku:'GAM-001', name:'Gaming Mouse V2', description:'6 customizable buttons', price:2299, category:'gaming', stock:35 },
  { sku:'GAM-002', name:'Mechanical Keyboard', description:'RGB, blue switches', price:4599, category:'gaming', stock:20 },
  { sku:'GAM-003', name:'Headset Pro', description:'7.1 surround', price:3399, category:'gaming', stock:18 },
  { sku:'GAM-004', name:'Gaming Chair', description:'Ergonomic, adjustable', price:8999, category:'gaming', stock:8 },
  { sku:'GAM-005', name:'Joystick Elite', description:'Flight sim joystick', price:5499, category:'gaming', stock:5 },

  { sku:'ELEC-006', name:'Portable Speaker', description:'10W, Bluetooth', price:1499, category:'electronics', stock:30 },
  { sku:'APP-006', name:'Socks (3 pack)', description:'Comfort cotton', price:299, category:'apparel', stock:120 },
  { sku:'GAM-006', name:'Gamepad Wireless', description:'Bluetooth gamepad', price:3199, category:'gaming', stock:22 },
  { sku:'ELEC-007', name:'Action Camera Mini', description:'1080p waterproof', price:5999, category:'electronics', stock:7 },
  { sku:'APP-007', name:'Windbreaker Jacket', description:'Lightweight windproof', price:1999, category:'apparel', stock:15 }
];

const seedProducts = async () => {
  try {
    await connectMongoDB();
    
    await Product.deleteMany();
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Created ${products.length} products successfully`);
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;