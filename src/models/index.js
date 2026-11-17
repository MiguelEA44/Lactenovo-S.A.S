const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const CarteraCredito = require('./CarteraCredito');
const Producto = require('./Producto');
const Factura = require('./Factura');
const DetalleFactura = require('./DetalleFactura');
const Reintegro = require('./Reintegro');
const CargueInventario = require('./CargueInventario');

// Asociaciones según el Diagrama de Clases
Cliente.hasOne(CarteraCredito, { foreignKey: 'clienteId', as: 'cartera' });
CarteraCredito.belongsTo(Cliente, { foreignKey: 'clienteId' });

Usuario.hasMany(Factura, { foreignKey: 'vendedoraId', as: 'facturas' });
Factura.belongsTo(Usuario, { foreignKey: 'vendedoraId', as: 'vendedora' });

Cliente.hasMany(Factura, { foreignKey: 'clienteId', as: 'facturas' });
Factura.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Factura.hasMany(DetalleFactura, { foreignKey: 'facturaId', as: 'detalles' });
DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId' });

Producto.hasMany(DetalleFactura, { foreignKey: 'productoId' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

Producto.hasMany(Reintegro, { foreignKey: 'productoId' });
Reintegro.belongsTo(Producto, { foreignKey: 'productoId' });

Factura.hasMany(Reintegro, { foreignKey: 'facturaId' });
Reintegro.belongsTo(Factura, { foreignKey: 'facturaId' });

Producto.hasMany(CargueInventario, { foreignKey: 'productoId' });
CargueInventario.belongsTo(Producto, { foreignKey: 'productoId' });

Usuario.hasMany(CargueInventario, { foreignKey: 'vendedoraId' });
CargueInventario.belongsTo(Usuario, { foreignKey: 'vendedoraId' });

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  CarteraCredito,
  Producto,
  Factura,
  DetalleFactura,
  Reintegro,
  CargueInventario
};
