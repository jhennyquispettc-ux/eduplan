# courses-service

Microservicio de EDUPLAN que gestiona el catálogo académico: categorías y carreras
(cursos, módulos y lecciones en la siguiente fase).

## Stack

- NestJS 12 + TypeScript (ESM)
- PostgreSQL (`courses_db`) con TypeORM y migraciones
- Swagger en `/api/docs` (solo fuera de producción)

## Ejecutar en local

Requiere el contenedor de PostgreSQL levantado desde la raíz del repo (`docker compose up -d`).

```bash
cp .env.example .env
npm install
npm run start:dev
```

Las migraciones pendientes se aplican automáticamente al arrancar.

## Migraciones

```bash
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
npm run migration:run
npm run migration:revert
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servicio y de la BD |
| GET | `/api/categories?page&limit&search` | Listar categorías |
| GET | `/api/categories/:id` | Obtener categoría |
| POST | `/api/categories` | Crear categoría |
| PATCH | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Borrado lógico |
| GET | `/api/careers?page&limit&search` | Listar carreras |
| GET | `/api/careers/:id` | Obtener carrera |
| POST | `/api/careers` | Crear carrera |
| PATCH | `/api/careers/:id` | Actualizar carrera |
| DELETE | `/api/careers/:id` | Borrado lógico |
