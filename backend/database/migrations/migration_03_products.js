// backend/database/migrations/03_create_products_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 150]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 1000]
        }
      },
      slug: {
        type: DataTypes.STRING(170),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-z0-9-]+$/
        }
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0
        }
      },
      min_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
          isInt: true,
          min: 0
        }
      },
      unit: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'un',
        validate: {
          isIn: [['un', 'kg', 'g', 'l', 'ml', 'fatia', 'porção', 'dúzia']]
        }
      },
      preparation_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tempo de preparo em minutos',
        validate: {
          isInt: true,
          min: 0
        }
      },
      ingredients: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      nutritional_info: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });

    // Índices para performance
    await queryInterface.addIndex('products', ['slug'], { unique: true });
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['is_active']);
    await queryInterface.addIndex('products', ['is_featured']);
    await queryInterface.addIndex('products', ['price']);
    await queryInterface.addIndex('products', ['stock_quantity']);
    await queryInterface.addIndex('products', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};