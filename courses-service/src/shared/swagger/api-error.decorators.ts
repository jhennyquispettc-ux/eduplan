import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

export interface ErrorExample {
  code: string;
  message: string;
}

function apiError(status: number, description: string, errors: ErrorExample[]) {
  const examples = Object.fromEntries(
    errors.map(({ code, message }) => [
      code,
      {
        summary: code,
        value: {
          statusCode: status,
          error: code,
          message,
          path: '/api/resource',
          timestamp: '2026-10-18T12:00:00.000Z',
        },
      },
    ]),
  );

  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiResponse({
      status,
      description,
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ErrorResponseDto) },
          examples,
        },
      },
    }),
  );
}

const VALIDATION_ERROR: ErrorExample = {
  code: 'BAD_REQUEST',
  message: 'name must be shorter than or equal to 100 characters',
};

export const ApiValidationError = (...errors: ErrorExample[]) =>
  apiError(400, 'Datos inválidos.', [VALIDATION_ERROR, ...errors]);

export const ApiNotFound = (...errors: ErrorExample[]) =>
  apiError(404, 'Recurso no encontrado.', errors);

export const ApiConflict = (...errors: ErrorExample[]) =>
  apiError(409, 'Conflicto con el estado actual.', errors);

export const ApiUnprocessable = (...errors: ErrorExample[]) =>
  apiError(422, 'La operación no es válida en el estado actual.', errors);
