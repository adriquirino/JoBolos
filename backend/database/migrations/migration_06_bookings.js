// backend/database/migrations/06_create_bookings_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      booking_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isAfter: new Date().toISOString().split('T')[0]
        }
      },
      event_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      delivery_type: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        allowNull: false,
        defaultValue: 'pickup',
        validate: {
          isIn: [['pickup', 'delivery']]
        }
      },
      delivery_address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      delivery_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'partial', 'paid', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'pix', 'bank_transfer'),
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observações do cliente'
      },
      admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observações internas'
      },
      confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      prepared_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      delivered_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('bookings', ['booking_number'], { unique: true });
    await queryInterface.addIndex('bookings', ['user_id']);
    await queryInterface.addIndex('bookings', ['event_date']);
    await queryInterface.addIndex('bookings', ['status']);
    await queryInterface.addIndex('bookings', ['payment_status']);
    await queryInterface.addIndex('bookings', ['delivery_type']);
    await queryInterface.addIndex('bookings', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bookings');
  }
};