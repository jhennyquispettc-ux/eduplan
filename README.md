# EDUPLAN Backend

Plataforma de orientación vocacional y cursos de nivelación preuniversitaria.

Arquitectura de microservicios en NestJS:

- `api-gateway`: punto único de entrada (proxy inverso, JWT, CORS, logging, rate limiting).
- `auth-service`: usuarios y autenticación.
- `courses-service`: categorías, carreras, cursos, módulos y lecciones.
- PostgreSQL con una base de datos por servicio.

## Arranque rápido con Docker

Requisitos: Docker Desktop (o Docker Engine con Compose v2).

```bash
docker compose up -d --build
docker compose exec auth-service npm run seed:prod
```

El segundo comando crea el administrador inicial (`admin@eduplan.bo` / `Admin12345` por defecto).
Es idempotente: puede ejecutarse varias veces sin duplicar datos.

| Servicio | URL | Expuesto a |
|---|---|---|
| api-gateway | http://localhost:3000/api | la red |
| auth-service (Swagger) | http://localhost:3001/api/docs | solo esta máquina |
| courses-service (Swagger) | http://localhost:3002/api/docs | solo esta máquina |
| PostgreSQL | localhost:5433 | solo esta máquina |

Todas las variables tienen valores por defecto en `docker-compose.yml`. Para cambiarlas, copia
`.env.example` a `.env` y edítalo.

> Documentación completa en construcción.
