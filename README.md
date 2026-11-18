Lactenovo S.A.S. — API REST de Gestión de Pedidos, Inventario y Clientes

Proyecto final de Ingeniería Web II (Módulos 1 y 2) — Universidad Manuela Beltrán.

Estructura del Proyecto

src/: Código fuente de la API REST (Node.js + Express + Sequelize + JWT + Swagger + Prometheus).

tests/: Suite de pruebas automatizadas con Jest y Supertest.

k8s/: Manifiestos de Kubernetes (Namespace, ConfigMap, Deployment, Service, HPA).

infra/: Infraestructura como Código con Terraform (AWS EC2 + Security Group).

monitoring/: Configuración de recolección de métricas para Prometheus.

.github/workflows/ci.yml: Pipeline de CI/CD con GitHub Actions y GHCR.

Ejecución Rápida con Docker Compose

Copiar variables de entorno:

cp .env.example .env

Levantar todos los servicios:

docker compose up --build -d

Verificar endpoints:

Healthcheck: http://localhost:3000/health

Swagger UI: http://localhost:3000/api-docs

Prometheus: http://localhost:9090

Grafana: http://localhost:3001