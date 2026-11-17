const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reintegro = sequelize.define('Reintegro', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productoId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  facturaId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reintegros',
  timestamps: false
});

module.exports = Reintegro;
