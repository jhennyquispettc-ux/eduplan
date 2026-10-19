# courses-service

Microservicio de EDUPLAN que gestiona el catálogo académico: categorías, carreras, cursos,
módulos y lecciones.

## Stack

- NestJS 12 + TypeScript (ESM)
- PostgreSQL (`courses_db`) con TypeORM y migraciones
- Swagger en `/api/docs` (solo fuera de producción)

## Identidad del usuario

El API Gateway valida el JWT y reenvía al servicio las cabeceras `x-user-id` y `x-user-role`.
Con `x-user-role: ADMIN` se ven también los cursos en `DRAFT`; cualquier otro valor (o su ausencia)
se trata como `STUDENT`, que solo ve cursos `PUBLISHED` y su contenido.

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
| GET | `/api/courses?page&limit&search&categoryId&status` | Listar cursos |
| GET | `/api/courses/:id` | Detalle con módulos y lecciones |
| GET | `/api/courses/:id/export` | Curso completo para uso sin conexión |
| POST | `/api/courses` | Crear curso (DRAFT) |
| PATCH | `/api/courses/:id` | Actualizar curso |
| PATCH | `/api/courses/:id/status` | Publicar / despublicar |
| DELETE | `/api/courses/:id` | Borrado lógico en cascada |
| GET | `/api/modules?courseId` | Listar módulos de un curso |
| GET | `/api/modules/:id` | Obtener módulo |
| POST | `/api/modules` | Crear módulo |
| PATCH | `/api/modules/:id` | Actualizar módulo |
| DELETE | `/api/modules/:id` | Borrado lógico en cascada |
| GET | `/api/lessons?moduleId` | Listar lecciones de un módulo |
| GET | `/api/lessons/:id` | Obtener lección |
| POST | `/api/lessons` | Crear lección TEXT o VIDEO |
| PATCH | `/api/lessons/:id` | Actualizar lección |
| DELETE | `/api/lessons/:id` | Borrado lógico |
