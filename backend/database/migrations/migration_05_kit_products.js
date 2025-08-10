// backend/database/migrations/05_create_kit_products_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kit_products', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      kit_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'kits',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isInt: true,
          min: 1
        }
      },
      is_optional: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Se o produto é opcional no kit'
      },
      additional_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Preço adicional se o produto for opcional',
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observações sobre o produto no kit'
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

    // Índices para performance e integridade
    await queryInterface.addIndex('kit_products', ['kit_id', 'product_id'], { 
      unique: true,
      name: 'unique_kit_product'
    });
    await queryInterface.addIndex('kit_products', ['kit_id']);
    await queryInterface.addIndex('kit_products', ['product_id']);
    await queryInterface.addIndex('kit_products', ['is_optional']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kit_products');
  }
};