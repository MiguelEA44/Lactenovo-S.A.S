const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/clientes:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clientes y Vendedoras]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', verificarToken, clienteController.listarClientes);
router.post('/', verificarToken, clienteController.crearCliente);
router.get('/:id/cartera', verificarToken, clienteController.consultarCartera);

module.exports = router;
