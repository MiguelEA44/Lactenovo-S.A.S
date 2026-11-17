const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const client = require('prom-client');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const facturaController = require('./controllers/facturaController');
const clienteController = require('./controllers/clienteController');
const { verificarToken, verificarRol } = require('./middlewares/auth');

const app = express();

// Seguridad HTTP (OWASP Top 10)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir interfaz web (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

// Instrumentación Prometheus
client.collectDefaultMetrics();
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2]
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
  });
  next();
});

// Endpoints de Salud, Métricas y Documentación OpenAPI 3.0
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de Negocio v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/facturas', facturaRoutes);
app.get('/api/v1/reportes/diario', verificarToken, facturaController.reporteDiario);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/clientes', clienteRoutes);
app.get('/api/v1/vendedoras', verificarToken, verificarRol(['administrador']), clienteController.listarVendedoras);

module.exports = app;
