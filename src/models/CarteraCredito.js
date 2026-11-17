const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarteraCredito = sequelize.define('CarteraCredito', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clienteId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  saldoPendiente: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  fechaUltimoPago: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cartera_credito',
  timestamps: true
});

module.exports = CarteraCredito;
