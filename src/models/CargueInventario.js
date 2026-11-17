const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CargueInventario = sequelize.define('CargueInventario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productoId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cantidadCargada: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendedoraId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'cargues_inventario',
  timestamps: false
});

module.exports = CargueInventario;
