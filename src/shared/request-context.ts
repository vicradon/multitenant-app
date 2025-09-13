import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  tenantId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
