const { Op } = require('sequelize');
const {
  sequelize,
  Factura,
  DetalleFactura,
  Producto,
  Cliente,
  CarteraCredito,
  Usuario
} = require('../models');

exports.registrarFactura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tipo, clienteId, items } = req.body;
    const vendedoraId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'La factura debe contener al menos un producto' });
    }

    const cliente = await Cliente.findByPk(clienteId, { transaction: t });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    let total = 0;
    const productosVerificados = [];

    for (const item of items) {
      const producto = await Producto.findByPk(item.productoId, { transaction: t });
      if (!producto) {
        await t.rollback();
        return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
      }
      if (producto.stockActual < item.cantidad) {
        await t.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stockActual}`
        });
      }
      const subtotal = Number(producto.precioActual) * Number(item.cantidad);
      total += subtotal;
      productosVerificados.push({ producto, cantidad: item.cantidad, subtotal });
    }

    if (tipo === 'credito') {
      const cartera = await CarteraCredito.findOne({ where: { clienteId }, transaction: t });
      const saldoActual = cartera ? Number(cartera.saldoPendiente) : 0;
      if (saldoActual + total > Number(cliente.limiteCredito)) {
        await t.rollback();
        return res.status(400).json({ error: 'El cliente supera su límite de crédito autorizado' });
      }
      if (cartera) {
        cartera.saldoPendiente = saldoActual + total;
        await cartera.save({ transaction: t });
      } else {
        await CarteraCredito.create({ clienteId, saldoPendiente: total }, { transaction: t });
      }
    }

    const factura = await Factura.create(
      { tipo, clienteId, vendedoraId, total, estado: 'activa' },
      { transaction: t }
    );

    for (const entry of productosVerificados) {
      await DetalleFactura.create(
        {
          facturaId: factura.id,
          productoId: entry.producto.id,
          cantidad: entry.cantidad,
          precioUnitario: entry.producto.precioActual,
          subtotal: entry.subtotal
        },
        { transaction: t }
      );
      entry.producto.stockActual -= entry.cantidad;
      await entry.producto.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({ mensaje: 'Factura registrada correctamente', factura });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al registrar factura', detalle: error.message });
  }
};

exports.listarFacturas = async (req, res) => {
  try {
    const { fecha, vendedoraId, tipo } = req.query;
    const where = {};
    if (tipo) where.tipo = tipo;
    if (vendedoraId) where.vendedoraId = vendedoraId;
    if (fecha) {
      const inicio = new Date(`${fecha}T00:00:00.000Z`);
      const fin = new Date(`${fecha}T23:59:59.999Z`);
      where.fecha = { [Op.between]: [inicio, fin] };
    }

    const facturas = await Factura.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'documento'] },
        { model: Usuario, as: 'vendedora', attributes: ['id', 'nombre'] },
        { model: DetalleFactura, as: 'detalles' }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar facturas', detalle: error.message });
  }
};

exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'vendedora', attributes: ['id', 'nombre', 'email'] },
        { model: DetalleFactura, as: 'detalles', include: [{ model: Producto, as: 'producto' }] }
      ]
    });
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar factura', detalle: error.message });
  }
};

exports.actualizarFactura = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });

    const { tipo } = req.body;
    if (tipo) factura.tipo = tipo;
    await factura.save();

    res.json({ mensaje: 'Factura actualizada', factura });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar factura', detalle: error.message });
  }
};

exports.anularFactura = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const factura = await Factura.findByPk(req.params.id, {
      include: [{ model: DetalleFactura, as: 'detalles' }],
      transaction: t
    });
    if (!factura) {
      await t.rollback();
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    if (factura.estado === 'anulada') {
      await t.rollback();
      return res.status(400).json({ error: 'La factura ya se encuentra anulada' });
    }

    for (const det of factura.detalles) {
      const prod = await Producto.findByPk(det.productoId, { transaction: t });
      if (prod) {
        prod.stockActual += det.cantidad;
        await prod.save({ transaction: t });
      }
    }

    factura.estado = 'anulada';
    await factura.save({ transaction: t });

    await t.commit();
    res.json({ mensaje: 'Factura anulada y stock reintegrado', factura });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al anular factura', detalle: error.message });
  }
};

exports.reporteDiario = async (req, res) => {
  try {
    const hoy = req.query.fecha || new Date().toISOString().split('T')[0];
    const inicio = new Date(`${hoy}T00:00:00.000Z`);
    const fin = new Date(`${hoy}T23:59:59.999Z`);

    const facturas = await Factura.findAll({
      where: {
        estado: 'activa',
        fecha: { [Op.between]: [inicio, fin] }
      }
    });

    const totalContado = facturas
      .filter((f) => f.tipo === 'contado')
      .reduce((acc, f) => acc + Number(f.total), 0);

    const totalCredito = facturas
      .filter((f) => f.tipo === 'credito')
      .reduce((acc, f) => acc + Number(f.total), 0);

    res.json({
      fecha: hoy,
      cantidadFacturas: facturas.length,
      totalContado,
      totalCredito,
      totalGeneral: totalContado + totalCredito
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte diario', detalle: error.message });
  }
};
