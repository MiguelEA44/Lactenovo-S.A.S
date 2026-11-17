const { Cliente, CarteraCredito, Usuario } = require('../models');

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: CarteraCredito, as: 'cartera' }]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar clientes', detalle: error.message });
  }
};

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, documento, telefono, direccion, limiteCredito } = req.body;
    const cliente = await Cliente.create({
      nombre,
      documento,
      telefono,
      direccion,
      limiteCredito: limiteCredito || 0
    });
    await CarteraCredito.create({ clienteId: cliente.id, saldoPendiente: 0 });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', detalle: error.message });
  }
};

exports.consultarCartera = async (req, res) => {
  try {
    const cartera = await CarteraCredito.findOne({
      where: { clienteId: req.params.id },
      include: [{ model: Cliente, attributes: ['nombre', 'documento', 'limiteCredito'] }]
    });
    if (!cartera) return res.status(404).json({ error: 'Cartera no encontrada para el cliente' });
    res.json(cartera);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar cartera', detalle: error.message });
  }
};

exports.listarVendedoras = async (req, res) => {
  try {
    const vendedoras = await Usuario.findAll({
      where: { rol: 'vendedora' },
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt']
    });
    res.json(vendedoras);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar vendedoras', detalle: error.message });
  }
};
