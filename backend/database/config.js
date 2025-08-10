const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'jobolos',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true // Soft delete
  }
});

// Models
const User = require('../models/User')(sequelize);
const Category = require('../models/Category')(sequelize);
const Product = require('../models/Product')(sequelize);
const Kit = require('../models/Kit')(sequelize);
const KitProduct = require('../models/KitProduct')(sequelize);
const Booking = require('../models/Booking')(sequelize);
const BookingItem = require('../models/BookingItem')(sequelize);

// Associations
// Category -> Products
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Kit -> Products (Many to Many)
Kit.belongsToMany(Product, { 
  through: KitProduct, 
  foreignKey: 'kit_id',
  otherKey: 'product_id',
  as: 'products'
});
Product.belongsToMany(Kit, { 
  through: KitProduct, 
  foreignKey: 'product_id',
  otherKey: 'kit_id',
  as: 'kits'
});

// User -> Bookings
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Booking -> BookingItems
Booking.hasMany(BookingItem, { foreignKey: 'booking_id', as: 'items' });
BookingItem.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// BookingItem -> Product
BookingItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(BookingItem, { foreignKey: 'product_id', as: 'booking_items' });

// BookingItem -> Kit
BookingItem.belongsTo(Kit, { foreignKey: 'kit_id', as: 'kit' });
Kit.hasMany(BookingItem, { foreignKey: 'kit_id', as: 'booking_items' });

const models = {
  User,
  Category,
  Product,
  Kit,
  KitProduct,
  Booking,
  BookingItem,
  sequelize
};

module.exports = models;
