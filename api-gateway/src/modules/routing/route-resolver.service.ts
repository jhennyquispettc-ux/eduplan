import { Injectable } from '@nestjs/common';
import { match, type MatchFunction } from 'path-to-regexp';
import { AppConfig } from '../../config/services/app.config.js';
import { ROUTE_TABLE, type RouteDefinition } from './route-table.js';

export interface ResolvedRoute extends RouteDefinition {
  params: Record<string, string>;
}

interface CompiledRoute {
  definition: RouteDefinition;
  matches: MatchFunction<Record<string, string>>;
}

@Injectable()
export class RouteResolverService {
  private readonly routes: CompiledRoute[];
  private readonly prefix: string;

  constructor(appConfig: AppConfig) {
    this.prefix = `/${appConfig.apiPrefix}`;
    this.routes = ROUTE_TABLE.map((definition) => ({
      definition,
      matches: match<Record<string, string>>(definition.path, {
        decode: decodeURIComponent,
      }),
    }));
  }

  resolve(method: string, path: string): ResolvedRoute | null {
    const relativePath = this.stripPrefix(path);
    if (relativePath === null) return null;

    for (const { definition, matches } of this.routes) {
      if (definition.method !== method) continue;
      const result = matches(relativePath);
      if (result) return { ...definition, params: result.params };
    }
    return null;
  }

  private stripPrefix(path: string): string | null {
    const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
    if (normalized === this.prefix) return '/';
    if (!normalized.startsWith(`${this.prefix}/`)) return null;
    return normalized.slice(this.prefix.length);
  }
}
