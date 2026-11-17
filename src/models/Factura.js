const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Factura = sequelize.define('Factura', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tipo: {
    type: DataTypes.ENUM('contado', 'credito'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activa', 'anulada'),
    defaultValue: 'activa'
  },
  total: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  clienteId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  vendedoraId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'facturas',
  timestamps: true
});

module.exports = Factura;
