# api-gateway

Punto único de entrada HTTP de EDUPLAN. No tiene base de datos: resuelve la ruta, aplica las
características transversales y reenvía la petición al microservicio correspondiente.

## Flujo de una petición

```
cliente
  │
  ├─ CORS (preflight y cabeceras permitidas)
  ├─ RequestIdMiddleware        → asigna / conserva x-request-id
  ├─ RequestLoggerMiddleware    → registra método, ruta, estado, duración, usuario y servicio
  ├─ RouteResolutionMiddleware  → busca la ruta en la lista blanca (route-table.ts)
  ├─ ThrottlerGuard             → 100 req/min por IP; 10 req/min en login y registro
  ├─ AccessGuard                → 404 si la ruta no existe, valida JWT HS256 y el rol requerido
  └─ ProxyController            → reenvía al servicio con x-user-id, x-user-role y x-request-id
```

## Características transversales

| Característica | Implementación |
|---|---|
| Validación de JWT y roles | `modules/access` (AccessGuard + AccessTokenVerifier) |
| CORS | `config/cors.options.ts` (orígenes en `CORS_ORIGINS`) |
| Logging / tracing | `common/middleware` (x-request-id propagado a los servicios) |
| Rate limiting | `modules/rate-limit` (`@nestjs/throttler`, límites globales y de credenciales) |

## Política de acceso

Cada ruta permitida está declarada en `src/modules/routing/route-table.ts` con su servicio de
destino y su política: `PUBLIC`, `AUTHENTICATED` o una lista de roles. Lo que no está en la tabla
responde `404 ROUTE_NOT_FOUND`.

- Públicas: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /careers`
  (el formulario de registro necesita listar las carreras) y `GET /health`.
- Cualquier usuario autenticado: lectura del catálogo, cursos, módulos, lecciones y `/users/me`.
- Solo `ADMIN`: escritura del catálogo, publicación de cursos y gestión de usuarios.

El gateway elimina cualquier `x-user-id` / `x-user-role` enviado por el cliente y los reemplaza por
los datos del token verificado.

## Errores propios del gateway

| Código | Estado | Cuándo |
|---|---|---|
| `ROUTE_NOT_FOUND` | 404 | La ruta o el método no están en la lista blanca |
| `MISSING_TOKEN` | 401 | Falta `Authorization: Bearer <token>` |
| `INVALID_TOKEN` | 401 | Firma, formato o payload inválidos |
| `TOKEN_EXPIRED` | 401 | El access token expiró |
| `INSUFFICIENT_ROLE` | 403 | El rol del usuario no tiene permiso |
| `TOO_MANY_REQUESTS` | 429 | Se superó el límite de peticiones |
| `UPSTREAM_UNAVAILABLE` | 502 | El servicio de destino no responde |
| `UPSTREAM_TIMEOUT` | 504 | El servicio tardó más de `PROXY_TIMEOUT_MS` |

## Ejecutar en local

Requiere auth-service (`:3001`) y courses-service (`:3002`) en ejecución.

```bash
cp .env.example .env
npm install
npm run start:dev
```

`JWT_ACCESS_SECRET` debe ser idéntico al de auth-service.

`GET /api/health` responde `200` solo si ambos servicios están disponibles e indica cuál falla en
caso contrario.
