const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Autenticación de usuario y obtención de JWT
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente
 */
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
