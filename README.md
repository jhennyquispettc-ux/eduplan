# EDUPLAN Backend

Plataforma de orientación vocacional y cursos de nivelación preuniversitaria.

Arquitectura de microservicios en NestJS:

- `api-gateway`: punto único de entrada (proxy inverso, JWT, CORS, logging, rate limiting).
- `auth-service`: usuarios y autenticación.
- `courses-service`: categorías, carreras, cursos, módulos y lecciones.
- PostgreSQL con una base de datos por servicio.

> Documentación completa en construcción.
