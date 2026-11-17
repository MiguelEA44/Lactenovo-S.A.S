const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/facturas:
 *   get:
 *     summary: Listar facturas con filtros
 *     tags: [Pedidos y Facturación]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *   post:
 *     summary: Registrar nueva factura
 *     tags: [Pedidos y Facturación]
 *     responses:
 *       201:
 *         description: Factura creada
 */
router.post('/', verificarToken, facturaController.registrarFactura);
router.get('/', verificarToken, facturaController.listarFacturas);
router.get('/:id', verificarToken, facturaController.obtenerFacturaPorId);
router.put('/:id', verificarToken, facturaController.actualizarFactura);
router.delete('/:id', verificarToken, verificarRol(['administrador']), facturaController.anularFactura);

module.exports = router;
