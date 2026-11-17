const request = require('supertest');
const app = require('../src/app');

describe('Pruebas de Integración - API Lactenovo S.A.S.', () => {
  it('GET /health debe responder 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /metrics debe exponer métricas en formato Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('http_request_duration_seconds');
  });

  it('POST /api/v1/facturas sin token JWT debe devolver 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/facturas')
      .send({ tipo: 'contado', items: [] });
    expect(res.statusCode).toEqual(401);
  });

  it('GET /api/v1/inventario sin token JWT debe devolver 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/inventario');
    expect(res.statusCode).toEqual(401);
  });
});
