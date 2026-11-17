const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Lactenovo S.A.S. API REST',
      version: '1.0.0',
      description: 'API REST para gestión de pedidos, facturación, inventario, clientes y vendedoras de Lactenovo S.A.S.'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
