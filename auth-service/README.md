# auth-service

Microservicio de EDUPLAN responsable de la identidad: registro de estudiantes, inicio de sesión,
emisión y rotación de tokens, y gestión de usuarios por parte del administrador.

## Stack

- NestJS 12 + TypeScript (ESM)
- PostgreSQL (`auth_db`) con TypeORM y migraciones
- bcrypt para contraseñas, `@nestjs/jwt` (HS256) para access tokens
- Swagger en `/api/docs` (solo fuera de producción)

## Tokens

| Token | Formato | Vida | Dónde se guarda |
|---|---|---|---|
| Access token | JWT HS256 con `{ sub, email, role }` | 15 min | Solo en el cliente |
| Refresh token | Cadena aleatoria opaca (48 bytes, base64url) | 7 días | Hash SHA-256 en `refresh_tokens` |

- Cada `POST /auth/refresh` revoca el token usado y entrega uno nuevo (rotación).
- Si llega un refresh token que ya fue rotado, se asume robo y se revocan todas las sesiones del usuario.
- El API Gateway valida el access token con el mismo `JWT_ACCESS_SECRET` y reenvía `x-user-id`
  y `x-user-role` a los servicios.

## Estados de la cuenta

`PENDING` (recién registrado, no puede iniciar sesión) → `ACTIVE` (aprobado por un admin) ⇄ `INACTIVE`.

## Ejecutar en local

Requiere PostgreSQL levantado desde la raíz del repo (`docker compose up -d`) y, para validar la
carrera en el registro, courses-service en `COURSES_SERVICE_URL`.

```bash
cp .env.example .env
npm install
npm run start:dev
```

Crear el administrador inicial (idempotente, usa las variables `SEED_ADMIN_*`):

```bash
npm run seed
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio y de la BD |
| POST | `/api/auth/register` | Registro de estudiante (queda `PENDING`) |
| POST | `/api/auth/login` | Inicio de sesión |
| POST | `/api/auth/refresh` | Rotación de tokens |
| POST | `/api/auth/logout` | Revoca el refresh token |
| GET | `/api/users/me` | Mi perfil |
| PATCH | `/api/users/me` | Actualizar mi perfil |
| PATCH | `/api/users/me/password` | Cambiar mi contraseña |
| GET | `/api/users?page&limit&search&status&role` | Listar usuarios (admin) |
| GET | `/api/users/:id` | Obtener usuario (admin) |
| POST | `/api/users` | Crear usuario (admin) |
| PATCH | `/api/users/:id` | Actualizar usuario (admin) |
| PATCH | `/api/users/:id/status` | Aprobar / desactivar (admin) |
| DELETE | `/api/users/:id` | Borrado lógico (admin) |
