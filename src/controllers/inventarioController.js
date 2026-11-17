const { sequelize, Producto, CargueInventario, Reintegro } = require('../models');

exports.consultarStock = async (req, res) => {
  try {
    const productos = await Producto.findAll({ order: [['nombre', 'ASC']] });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar inventario', detalle: error.message });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precioActual, stockActual } = req.body;
    const producto = await Producto.create({
      nombre,
      descripcion,
      precioActual,
      stockActual: stockActual || 0
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', detalle: error.message });
  }
};

exports.registrarCargue = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productoId, cantidadCargada } = req.body;
    const vendedoraId = req.user.id;

    const producto = await Producto.findByPk(productoId, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.stockActual += Number(cantidadCargada);
    await producto.save({ transaction: t });

    const cargue = await CargueInventario.create(
      { productoId, cantidadCargada, vendedoraId },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ mensaje: 'Cargue registrado', cargue, nuevoStock: producto.stockActual });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al registrar cargue', detalle: error.message });
  }
};

exports.registrarReintegro = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productoId, facturaId, cantidad, motivo } = req.body;

    const producto = await Producto.findByPk(productoId, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.stockActual += Number(cantidad);
    await producto.save({ transaction: t });

    const reintegro = await Reintegro.create(
      { productoId, facturaId: facturaId || null, cantidad, motivo },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ mensaje: 'Reintegro registrado', reintegro, nuevoStock: producto.stockActual });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al registrar reintegro', detalle: error.message });
  }
};

exports.consultarPrecios = async (req, res) => {
  try {
    const precios = await Producto.findAll({
      attributes: ['id', 'nombre', 'precioActual']
    });
    res.json(precios);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar precios', detalle: error.message });
  }
};

exports.actualizarPrecios = async (req, res) => {
  try {
    const { actualizaciones } = req.body; // [{ productoId, precioActual }]
    for (const item of actualizaciones) {
      await Producto.update(
        { precioActual: item.precioActual },
        { where: { id: item.productoId } }
      );
    }
    res.json({ mensaje: 'Precios actualizados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar precios', detalle: error.message });
  }
};
