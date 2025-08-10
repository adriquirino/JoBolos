// backend/database/migrations/07_create_booking_items_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('booking_items', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      kit_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'kits',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      item_type: {
        type: DataTypes.ENUM('product', 'kit'),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Nome do item no momento da compra'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descrição do item no momento da compra'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Preço unitário no momento da compra',
        validate: {
          isDecimal: true,
          min: 0
        }
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
      customizations: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
        comment: 'Personalizações específicas do item'
      },
      special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Instruções especiais para o item'
      },
      theme: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Tema específico para este item (se aplicável)'
      },
      colors: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Cores escolhidas para este item'
      },
      serves_people: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Quantidade de pessoas que este item serve'
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
    await queryInterface.addIndex('booking_items', ['booking_id']);
    await queryInterface.addIndex('booking_items', ['product_id']);
    await queryInterface.addIndex('booking_items', ['kit_id']);
    await queryInterface.addIndex('booking_items', ['item_type']);
    await queryInterface.addIndex('booking_items', ['created_at']);

    // Constraint para garantir que ou product_id ou kit_id esteja preenchido
    await queryInterface.addConstraint('booking_items', {
      fields: ['product_id', 'kit_id'],
      type: 'check',
      name: 'check_item_reference',
      where: Sequelize.literal('(product_id IS NOT NULL AND kit_id IS NULL) OR (product_id IS NULL AND kit_id IS NOT NULL)')
    });

    // Constraint para validar item_type com ids
    await queryInterface.addConstraint('booking_items', {
      fields: ['item_type', 'product_id', 'kit_id'],
      type: 'check',
      name: 'check_item_type_consistency',
      where: Sequelize.literal(
        "(item_type = 'product' AND product_id IS NOT NULL AND kit_id IS NULL) OR " +
        "(item_type = 'kit' AND kit_id IS NOT NULL AND product_id IS NULL)"
      )
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('booking_items');
  }
};