// backend/database/migrations/02_create_categories_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 100]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500]
        }
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-z0-9-]+$/
        }
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: true,
        defaultValue: '#6B46C1',
        validate: {
          is: /^#[0-9A-F]{6}$/i
        }
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          isInt: true,
          min: 0
        }
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
    await queryInterface.addIndex('categories', ['name'], { unique: true });
    await queryInterface.addIndex('categories', ['slug'], { unique: true });
    await queryInterface.addIndex('categories', ['is_active']);
    await queryInterface.addIndex('categories', ['sort_order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('categories');
  }
};