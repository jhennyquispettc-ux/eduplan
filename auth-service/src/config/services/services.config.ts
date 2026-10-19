import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServicesConfig {
  readonly coursesServiceUrl: string;

  constructor(config: ConfigService) {
    this.coursesServiceUrl = config
      .getOrThrow<string>('COURSES_SERVICE_URL')
      .replace(/\/$/, '');
  }
}
