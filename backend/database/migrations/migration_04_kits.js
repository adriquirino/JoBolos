// backend/database/migrations/04_create_kits_table.js
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kits', {
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
      theme: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [['princesa', 'super-heroi', 'unicornio', 'futebol', 'fazendinha', 'circo', 'frozen', 'minecraft', 'paw-patrol', 'peppa-pig', 'baby-shark', 'cocomelon', 'personalizado']]
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
      discount_price: {
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
      serves_people: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
          isInt: true,
          min: 1
        }
      },
      preparation_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tempo de preparo em horas',
        validate: {
          isInt: true,
          min: 0
        }
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
      is_customizable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      includes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Lista de itens inclusos no kit (decoração, utensílios, etc.)'
      },
      colors: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Cores disponíveis para o tema'
      },
      min_advance_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: 'Dias mínimos de antecedência para agendamento',
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
    await queryInterface.addIndex('kits', ['slug'], { unique: true });
    await queryInterface.addIndex('kits', ['theme']);
    await queryInterface.addIndex('kits', ['is_active']);
    await queryInterface.addIndex('kits', ['is_featured']);
    await queryInterface.addIndex('kits', ['price']);
    await queryInterface.addIndex('kits', ['serves_people']);
    await queryInterface.addIndex('kits', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kits');
  }
};