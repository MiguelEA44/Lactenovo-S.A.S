<<<<<<< HEAD
# Lactenovo-S.A.S
=======
# Lactenovo S.A.S. — API REST de Gestión de Pedidos, Inventario y Clientes

Proyecto final de Ingeniería Web II (Módulos 1 y 2) — Universidad Manuela Beltrán.

## Estructura del Proyecto
- `src/`: Código fuente de la API REST (Node.js + Express + Sequelize + JWT + Swagger + Prometheus).
- `tests/`: Suite de pruebas automatizadas con Jest y Supertest.
- `k8s/`: Manifiestos de Kubernetes (Namespace, ConfigMap, Deployment, Service, HPA).
- `infra/`: Infraestructura como Código con Terraform (AWS EC2 + Security Group).
- `monitoring/`: Configuración de recolección de métricas para Prometheus.
- `.github/workflows/ci.yml`: Pipeline de CI/CD con GitHub Actions y GHCR.

## Ejecución Rápida con Docker Compose
1. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Levantar todos los servicios:
   ```bash
   docker compose up --build -d
   ```
3. Verificar endpoints:
   - Healthcheck: `http://localhost:3000/health`
   - Swagger UI: `http://localhost:3000/api-docs`
   - Prometheus: `http://localhost:9090`
   - Grafana: `http://localhost:3001`
>>>>>>> 896eece (feat: entrega completa lactenovo)
