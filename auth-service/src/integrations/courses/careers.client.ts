import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ServicesConfig } from '../../config/services/services.config.js';
import { CoursesServiceUnavailableException } from './courses-service-unavailable.exception.js';

const REQUEST_TIMEOUT_MS = 3000;

@Injectable()
export class CareersClient {
  private readonly logger = new Logger(CareersClient.name);

  constructor(private readonly servicesConfig: ServicesConfig) {}

  async exists(careerId: string): Promise<boolean> {
    const url = `${this.servicesConfig.coursesServiceUrl}/careers/${careerId}`;

    let response: Response;
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      this.logger.error(`GET ${url} failed: ${(error as Error).message}`);
      throw new CoursesServiceUnavailableException();
    }

    if (response.ok) return true;
    if (response.status === HttpStatus.NOT_FOUND) return false;

    this.logger.error(`GET ${url} answered ${response.status}`);
    throw new CoursesServiceUnavailableException();
  }
}
