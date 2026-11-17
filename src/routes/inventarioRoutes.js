const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/inventario:
 *   get:
 *     summary: Consultar stock actual por producto
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Inventario actualizado
 */
router.get('/', verificarToken, inventarioController.consultarStock);
router.post('/productos', verificarToken, verificarRol(['administrador']), inventarioController.crearProducto);
router.post('/cargue', verificarToken, inventarioController.registrarCargue);
router.post('/reintegro', verificarToken, inventarioController.registrarReintegro);
router.get('/precios', verificarToken, inventarioController.consultarPrecios);
router.put('/precios', verificarToken, verificarRol(['administrador']), inventarioController.actualizarPrecios);

module.exports = router;
